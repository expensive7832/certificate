"use client";

import Image from "next/image";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from 'sweetalert2'
import axios from "axios"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      message: "first name cannot be less than 2",
    })
    .max(50, {
      message: "first name cannot be more than 50",
    }),
  lastname: z
    .string()
    .min(2, {
      message: "last name cannot be less than 2",
    })
    .max(50, {
      message: "last name cannot be more than 50",
    }),
  email: z.string().email({
    message: "enter valid email",
  }),
  address: z.string().min(5),
  state: z.string().min(2),
  code: z.string().min(5),
  dob: z.string().date(),
  sid: z.string().min(5),
  password: z.string().min(5, {
      message: "password must be at least 5 characters",
    })
    .max(20, {
      message: "password cannot be more than 20 characters",
    }),
});

function page() {

 
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email:"",
      password:"",
      sid: "",
      dob:"",
      address:"",
      state:"",
      code:"",
    },
  });

  const router = useRouter()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
   
    setLoading(true)

    try{

      await axios.post(`http://localhost:3000/api/signup`, JSON.stringify(values))
    .then((res) => {
      setLoading(false)
      Swal.fire({
        title: "Registration",
        text: "Signup Successful",
        icon: "success"
      })

      router.push("/signin")

  })
  .catch((err) =>{
    setLoading(false)
    
    for(let i in err?.response?.data){
    
      Swal.fire({
        title: "Registration",
        text: err?.response?.data[i],
        icon: "error"
      })
      
    }
    
  })

    }catch(err){
      console.log(err);
      
    }

  
  }

  return (
    <div className="signup p-10">
      <div className="flex gap-3 items-center">
        <Image
          alt="logo"
          src={require("./../../../public/logo.png")}
          width={30}
          height={30}
          objectFit="contain"
        />

        <h6>Horizon</h6>
      </div>

      <div className="flex my-5 gap-3 flex-col">
        <h2 className="text-lg font-bold">Log In</h2>
        <p className="text-sm">Welcome back! Please enter your details.</p>
      </div>

      {/* signup form */}
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap items-center md:flex-row flex-col md:gap-3 gap-1"
          >
            <div className="md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FirstName</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LastName</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOB</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-[45%] w-full">
              <FormField
                control={form.control}
                name="sid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IDENTITY</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           {
            loading ? 
            <Image
            src={require("./../../../public/load.gif")}
            alt="loading"
            width={50}
            height={50}
            className=""
            />

            :

            <Button color="blue" type="submit">Submit</Button>
           }
          </form>
        </Form>

        <div className="text-center">
           Don't You Have An Account? <Link href={"/signin"}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default page;
