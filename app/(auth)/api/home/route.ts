"use server"
import dbConnect from "@/lib/connectDB"
import User from "@/lib/models/User"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request:NextRequest){

    
    try {
        await dbConnect() 
        
        if(request.headers.has("authorization")) {
            let authToken: any = request.headers.get("authorization")
            let token = authToken.split(" ")[1]
            let decoded: any = await jwt.verify(token, process.env.JWT_TOKEN!)

            let user = await User.findById(decoded.id).exec();

            
            

            return NextResponse.json(user, {status: 200})



        }else{

           return NextResponse.json({message: "invalid credentials"}, {status: 400})

        }

        


        // let user = await User.findOne({email: email}).exec()

      
    
    } catch (error: any) {
        NextResponse.json({message: error.message}, {status: 400})
        console.log(error);
        
    }
    
   
}