"use client";

import Image from "next/image";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/lib/redux/store";
import { login } from "@/lib/redux/slices/userslice";

const formSchema = z.object({
  email: z.string().email({
    message: "enter valid email",
  }),
  password: z.string().min(1, {
      message: "password cannot be empty",
    })
    
});

function page() {

  const dispatch = useDispatch()

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    await axios.post("/api/login", values)
    .then((res) =>{
      setLoading(false)
      dispatch(login(res?.data))
      router.push("/")
      
    }).catch((err) =>{
      setLoading(false)
      
      Swal.fire({
        title: "Authentication",
        text: err.response.data,
        icon:"error"
      })
      
    })
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
           Don't You Have An Account? <Link href={"/signup"}>SIGNUP</Link>
        </div>
      </div>
    </div>
  );
}

export default page;
