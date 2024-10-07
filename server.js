// server.js
const express = require("express");
const next = require("next");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

const db = require("./db.js");

// middleware

const protect = require("./protect.js");
const { error } = require("console");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Start Next.js and express server
app.prepare().then(() => {
  const server = express();

  // swagger configuration
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "My API Documentation",
        version: "1.0.0",
        description: "API documentation for My API",
      },
      servers: [
        {
          url: "http://localhost:6500",
        },
      ],
    },
    apis: ["server.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // Example API route
  server.get("/api/", (req, res) => {
    res.status(200).json("api working");
  });

  server.post("/api/login", (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields) => {
        const { email, password } = fields;

        if (email === "" || password === "") {
          res.status(400).json("please add all field");
        } else {
          let sql = "SELECT * FROM users WHERE email = ?";
          db.query(sql, [email], async (err, result) => {
            let data = result[0];

            if (data === undefined) {
              res.status(400).json("invalid credentials");
            } else {
              //check password
              bcrypt
                ?.compare(password, data?.password)
                .then((confirm) => {
                  if (confirm) {
                    let token = jwt?.sign(
                      { id: data?.id, email: data?.email },
                      process.env.NEXT_PUBLIC_JWT_SECRET,
                      {
                        expiresIn: "30d", //may change time later
                      }
                    );

                    res.status(200).json({
                      token: token,
                      data: {
                        id: data?.id,
                        email: data?.email,
                        fname: data?.fname,
                        lname: data?.lname,
                        role: data?.role,
                      },
                      message: "login successful",
                    });
                  } else {
                    res.status(400).json("invalid credentials");
                  }
                })
                .catch((err) => res.status(400).json(err));
            }
          });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  });
  // upload certificate

  server.post("/api/upload", protect, (req, res) => {
    try {
      if (req.user === null || req.user.role !== "admin") {
        return res.status(400).json("unauthorized");
      } else {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
          const { id, fname, lname, email } = fields;
          const { certificate } = files;

          if (id == "" || certificate.originalFilename === "") {
            return res
              .status(400)
              .json("select a student and upload a certificate");
          } else {
            let chksql = "SELECT * FROM certificate where uid = ?";

            db.query(chksql, [id], (err, result) => {
             
              if (result.length > 0) {
                return res.status(400).json("certificate already exists");
              } else {
                cloudinary.config({
                  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
                  api_key: process.env.NEXT_PUBLIC_CLOUD_KEY,
                  api_secret: process.env.NEXT_PUBLIC_CLOUD_SECRET,
                  secure: true,
                });

                cloudinary.uploader.upload(
                  certificate?.filepath,
                  async (err, data) => {
                    if (err) {
                      return res.status(400).json({
                        message: "image upload error, try again",
                      });
                    } else {
                      let imgid = data.public_id;
                      let imgurl = data.secure_url;

                      let sql =
                        "INSERT INTO certificate(uid, imgurl, imgid, addedby, fname, lname, email) VALUES(?,?,?,?,?,?,?)";

                      db.query(
                        sql,
                        [id, imgurl, imgid, req.user.id, fname, lname, email],
                        (err, result) => {
                          if (err) {
                            res.status(400).json(error.message);
                          } else {
                            res.status(200).json("upload successfullly");
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    } catch (err) {
      res.status(400).json({ message: err });
    }
  });

  server.get("/api/searchbystudent", (req, res) => {
    let { q, id } = req.query;

  

    if (q === "") {
      return res.status(400).json("enter student name ");
    } else {
      let sql =
        "SELECT * FROM certificate where fname LIKE ? OR email like ? OR lname LIKE ?";
      db.query(sql, [`%${q}%`, `%${q}%`, `%${q}%`], (err, result) => {
        if (err) {
          return res.status(400).json(err.message);
        }else if(result == 0){
          return res.status(200).json([])
        } else {
          let theuser = result.find((row) => row.uid == id)
        
          return res.status(200).json(theuser);
        }
      });
    }
  });

  server.get("/api/adminsearch", (req, res) => {
    let { q } = req.query;

  

    if (q === "") {
      return res.status(400).json("enter student name ");
    } else {
      let sql =
        "SELECT * FROM users where fname LIKE ? OR email like ? OR lname LIKE ?";
      db.query(sql, [`%${q}%`, `%${q}%`, `%${q}%`], (err, result) => {
        if (err) {
          return res.status(400).json(err.message);
        }else if(result == 0){
          return res.status(200).json([])
        } else {
          return res.status(200).json(result);
        }
      });
    }
  });
  server.get("/api/sendmail", (req, res) => {
    const { email, id } = req.query;

    let code = "";

        for (let i = 0; i < 4; i++) {
          let rn = Math.floor(Math.random() * 9);
          code += String(rn);
        }

        print(code)

    let sql = "UPDATE certificate SET code = ? WHERE uid = ?";

    db.query(sql, [code, id], (err, result) => {
      if (err) {
        return res.status(400).json(err.message);
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "expensive7832@gmail.com",
            pass: "axjo xadw ffup cnxo",
          },
        });


        // Define email options
        const mailOptions = {
          from: "certificate@lasop.net", // sender address
          to: email, // list of receivers
          subject: "Verification Code", // Subject line
          html: `<h3>Verification Code</h3>
                <h1>${code}</h1>
              `, // HTML body
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(400).json(error.message);
          } else {
            return res.status(200).json("sent");
          }
        });
      }
    });
  });

  // Handle all other requests with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.NEXT_PUBLIC_PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
