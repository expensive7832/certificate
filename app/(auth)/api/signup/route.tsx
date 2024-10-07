"use server"
import dbConnect from "@/lib/connectDB"
import User from "@/lib/models/User"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(request:NextRequest){

    
    try {
        await dbConnect() 
        
        let {
            address, code, state, sid, email, 
            firstname,lastname,password,dob
        } = await request.json()

        if(address === "" || code === "" || state === "" || sid === "" || email === "" || firstname === "" || lastname === "" || password === "" || dob === ""){

            return NextResponse.json({message: "all fields are required"}, { status: 400})
            
        }else{

        
       
        
        let checkemail = await User.findOne({email: email}).exec()

        if(checkemail !== null){

            return NextResponse.json({message: "email already exists"}, {status:400})
        }else{

            let salt = await bcrypt.genSalt(10)
            let hashPwd = await bcrypt.hash(password, salt)
            
            await User.create({
                fname: firstname,
                lname: lastname,
                email,
                password: hashPwd,
                address,
                state,
                code,
                identity: sid,
                dob
            })

            return NextResponse.json("success", {status:200})



        }


    }    

        //     // if(checkemail == null){

        //         // let salt = await bcrypt.genSalt()

        //         // let hashPwd = await bcrypt.hash(password, salt)


        // //     //     // User.create({
        // //     //     //     fname: firstname,
        // //     //     //     lname: lastname,
        // //     //     //     email,
        // //     //     //     password: hashPwd,
        // //     //     //     address,
        // //     //     //     code,
        // //     //     //     state,
        // //     //     //     identity: sid,
        // //     //     //     dob
        // //     //     // })

        // //     //     // return NextResponse.json({message: hashPwd}, {status: 201})
        // //     // }else{
        // //     //     return NextResponse.json({message: "Email Already Exists"}, {status: 400})
        //     // }

    
    } catch (error: any) {
        // NextResponse.json({message: error.message})
        console.log(error);
        
    }
    
   
}