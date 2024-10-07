"use server"
import dbConnect from "@/lib/connectDB"
import User from "@/lib/models/User"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export async function POST(request:NextRequest){

    
    try {
        await dbConnect() 
        
        let { email,password } = await request.json()


        let user = await User.findOne({email: email}).exec()

        if(user === null){

            return NextResponse.json({message: "email not found"}, {status:400})
        }else{
           let check = await bcrypt.compare(password, user?.password)

           let token = await jwt.sign({email: user?.email, id: user._id}, process.env.JWT_TOKEN!, {
            expiresIn: "3d"
           })

          
           

           if(check){
            return NextResponse.json({message: "login successful", token }, {status:200})
           }else{
            return NextResponse.json({message: "invalid credentials"}, {status:400})
           }
        }   

    
    } catch (error: any) {
        NextResponse.json({message: error.message})
        console.log(error);
        
    }
    
   
}