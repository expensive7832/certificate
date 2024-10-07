"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { LogInIcon, LogOutIcon, Search } from "lucide-react";
import { sideBarLinks } from "@/lib/siderbarlinks";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "@/lib/redux/store";
import axios from "axios";
import { logout } from "@/lib/redux/slices/userslice";
import { Button } from "./ui/button";

function leftdashboard({ user, login}: any) {
  
  const router = useRouter();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    router.push("/signin");
  };

  const pathname = usePathname();

  return (
    <div>
      <div className="flex gap-3 items-center">
        <Image
          alt="logo"
          src={require("./../public/logo.png")}
          width={100}
          height={100}
          objectFit="contain"
        />
      </div>

      

    
     

      <div className="fixed left-0   bottom-0">
        <hr />
        <div className="items-center flex p-3 gap-3">
          <Image
            src={require("./../public/logo.png")}
            alt="logo"
            width={20}
            height={20}
            className="w-8 h-8 object-contain"
          />


          {login === true ? (
            
            <>
              <div>
                <h6 className="font-medium text-black">
                  {user?.fname} {user?.lname}
                </h6>
                <small className="font-medium text-black">{user?.email}</small>
              </div>

              {/* logout icon */}
              <button className="font-medium " onClick={handleLogout}>
                <LogOutIcon color="red" />
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/signin")}
              className="bg-blue-900 w-full p-2 rounded-md text-white"
            >
              Login
            </button>
          )}


        </div>
      </div>
    </div>
  );
}

export default leftdashboard;
