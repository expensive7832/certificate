"use client";

import { Menu,Search } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "@/lib/redux/store";
import axios from "axios";
import Leftdashboard from "@/components/leftdashboard";
import Rightdashboard from "@/components/rightdashboard";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import nodemailer from "nodemailer"

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

function Home() {

  const router = useRouter()
 
  const user: any = useSelector((state) => state.user.user);
  const login: boolean = useSelector((state) => state.user.login);
  const token = useSelector((state) => state.user.token);

  const [opensidebar, setopensidebar] = useState<boolean>(false);

  window.onresize = function () {
    let screen = window.matchMedia("(max-width: 768px)").matches;

    if (screen) {
      setopensidebar(false);
    }
  };



  const [stage, setstage] = useState(0)
  function handleNextPage(){
    setstage((prev) => prev + 1)
    router.push("/download")
  }

 
  const [search, setSearch] = useState("")
  const [status, setstatus] = useState(false)
  const [student, setStudent] = useState<any>()

  const [openreq, setopenreq] = useState(false)
  const [reqstatus, setreqstatus] = useState(false)

 
  // search student

  function handleSearchByStudent(){
  
    if(user?.role == "admin"){

      axios.get(`/api/adminsearch?q=${search}`)
    .then((res) => {
      setStudent(res.data)
    })
    .catch((err) => {
      Swal.fire({
        title: err?.response?.data,
        icon:"error"
      })
    })
    .finally(() => setstatus(true))

    }else{
      axios.get(`/api/searchbystudent?q=${search}&id=${user.id}`)
    .then((res) => {
      setStudent(res.data)
    })
    .catch((err) => {
      Swal.fire({
        title: err?.response?.data,
        icon:"error"
      })
    })
    .finally(() => setstatus(true))
    }
  }

  function handleEmailSent(id: number, email: string){
    setreqstatus(true)
    axios.get(`/api/sendmail?id=${id}&email=${email}`)
    .then(() => {
      Swal.fire({
      title: "Success",
      icon:"success"
    })
    setopenreq(true)
  })
    .catch((err) => Swal.fire({
      title: err?.response?.data,
      icon:"error"
    }))
    .finally(() => setreqstatus(false))
  }

  const [uploadstatus, setuploadstatus] = useState(false)

  function handleUpload(e: FormEvent<HTMLFormElement>,  id: any, fname: any, lname: any, email: any){
    e.preventDefault()
    setuploadstatus(true)
    let data = new FormData(e.currentTarget)

    data.append("fname", fname)
    data.append("lname", lname)
    data.append("email", email)
    data.append("id", id)

    axios.post("/api/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
    })
    .then(() => {
      Swal.fire({
        title: "certificate upload successfully",
        icon:"success"
      })
     
    }).catch((err) => {
      Swal.fire({
        title: err.response.data,
        icon:"error"
      })
    }).finally(() => setuploadstatus(false))
  }

  return (
    <main
      className={`flex min-h-screen md:p-10 gap-10 p-5 w-full justify-around  ${
        opensidebar && "bg-gray-400 p-[-1.25rem]"
      }`}
    >
      <section className="hidden md:block w-1/5">
        <Leftdashboard user={user} login={login} />
      </section>

      <section className="w-full md:w-2/5">
        <div>
          <div>
            <div className="flex gap-3">
              <Button
                onClick={() => setopensidebar((prev) => !prev)}
                className="hidden max-md:block"
              >
                <Menu />
              </Button>

              <Sidebar open={opensidebar} user={user} />

              <h3 className="font-bold text-2xl md:text-4xl">
                Welcome, <span className="text-blue-400 capitalize">{user?.fname}</span>
              </h3>
            </div>
            <p className="mt-2 mb-4">Access & manage your certificate.</p>
          </div>

          {/* <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: "45%" }}
            >
              {" "}
              0%
            </div>
          </div> */}

          {/* search */}

          <div className="my-3 flex p-1 items-center relative border rounded-lg h-10">
            <input
              placeholder="enter firstname, lastname or email address"
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="border-0 focus:outline-0 w-full placeholder:relative placeholder:top-1 placeholder:text-[15px]"
            />
            <button onClick={handleSearchByStudent} className="bg-blue-600 p-3 rounded-tr rounded-br absolute right-0">
              <Search color="#fff" size={14} />
            </button>
          </div>
          {/* students */}
          <div className={`students ${status ? "block" : "hidden"}`}>
            <div className="max-w-2xl mx-auto">
              <div className="p-4 max-w-md bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Student Data
                  </h3>
                </div>
                <div className="flow-root">
                 
                 <ul
                 role="list"
                 className="divide-y divide-gray-200 dark:divide-gray-700"
               >
                 {
                  status && student?.length == 0?
                  <h1 className="fw-bold text-warning">check again later! your certificate is not ready</h1>:
                 student?.length > 0 ?
                  student?.map((row: any) =>(
                    <>
                 <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={row?.imgurl}
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {row?.fname}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {row?.email}
                          </p>
                        </div>
                        <div onClick={() =>handleEmailSent(row?.id, row?.email)} className="inline-flex cursor-pointer bg-blue-500 text-white p-1 rounded items-center text-base font-semibold dark:text-dark">
                          {openreq ? 
                          <div style={{borderTopColor:"transparent"}} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div> 
                          : "REQUEST"}
                        </div>
                       {user?.role == "student" &&
                        <Dialog open={openreq} onOpenChange={setopenreq}>
                        <DialogTrigger>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogDescription>
                              <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl">
                                <header className="mb-8">
                                  <h1 className="text-2xl font-bold mb-1">
                                    Verification
                                  </h1>
                                  <p className="text-[15px] text-slate-500">
                                    Enter the 4-digit verification code that
                                    was sent to your registered email.
                                  </p>
                                </header>
                                <form id="otp-form">
                                  <div className="flex items-center justify-center gap-3">
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      pattern="\d*"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                  </div>
                                  <div className="max-w-[260px] mx-auto mt-4">
                                    <button
                                    onClick={handleNextPage}
                                      type="submit"
                                      className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                                    >
                                      Verify Account
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                       
                       }
                       {
                        user?.role === "admin" && 
                        <Dialog>
                        <DialogTrigger>
                          <div className="inline-flex cursor-pointer bg-blue-500 text-white p-1 rounded items-center text-base font-semibold dark:text-dark">
                           UPLOAD
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogDescription>
                             <form onSubmit={(e) => handleUpload(e, row?.id, row?.fname, row?.lname, row?.email)}>
                                <div className="relative mb-4">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">certificate</label>
                                    <input type="file" id="email" name="certificate" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                                </div>
                                <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                {uploadstatus ? 
                                  <div style={{borderTopColor:"transparent"}} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div> : "UPLOAD"}
                                </button>
                             </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                       }
                      </div>
                    </li>
                 </>
                  ))
                 :
                 <>
                 <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={student?.imgurl}
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {student?.fname}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {student?.email}
                          </p>
                        </div>
                        <div onClick={() =>handleEmailSent(student?.id, student?.email)} className="inline-flex cursor-pointer bg-blue-500 text-white p-1 rounded items-center text-base font-semibold dark:text-dark">
                          {openreq ? 
                          <div style={{borderTopColor:"transparent"}} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div> 
                          : "REQUEST"}
                        </div>
                       {user?.role == "student" &&
                        <Dialog open={openreq} onOpenChange={setopenreq}>
                        <DialogTrigger>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogDescription>
                              <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl">
                                <header className="mb-8">
                                  <h1 className="text-2xl font-bold mb-1">
                                    Verification
                                  </h1>
                                  <p className="text-[15px] text-slate-500">
                                    Enter the 4-digit verification code that
                                    was sent to your registered email.
                                  </p>
                                </header>
                                <form id="otp-form">
                                  <div className="flex items-center justify-center gap-3">
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      pattern="\d*"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                    <input
                                      type="text"
                                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                      maxLength={1}
                                    />
                                  </div>
                                  <div className="max-w-[260px] mx-auto mt-4">
                                    <button
                                    onClick={handleNextPage}
                                      type="submit"
                                      className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                                    >
                                      Verify Account
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                       }
                       {
                        user?.role === "admin" && 
                        <Dialog>
                        <DialogTrigger>
                          <div className="inline-flex cursor-pointer bg-blue-500 text-white p-1 rounded items-center text-base font-semibold dark:text-dark">
                          UPLOAD
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogDescription>
                             <form onSubmit={(e) => handleUpload(e, student?.id, student?.fname, student?.lname, student?.email)}>
                                <div className="relative mb-4">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">certificate</label>
                                    <input type="file" id="email" name="certificate" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                                </div>
                                <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                {uploadstatus ? 
                                  <div style={{borderTopColor:"transparent"}} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div> : "UPLOAD"}
                                </button>
                             </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                       }
                      </div>
                    </li>
                 </>
                 }
               </ul>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block w-1/5">
        <Rightdashboard user={user} />
      </section>
    </main>
  );
}

export default Home;
