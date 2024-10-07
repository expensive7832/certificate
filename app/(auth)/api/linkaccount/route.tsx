import dbConnect from "@/lib/connectDB"
import { NextRequest, NextResponse } from "next/server"
import { Mono } from "mono-node";
import User from "@/lib/models/User";
import axios from "axios";
import { Error } from "mongoose";

const monoClient = new Mono({
    secretKey:  process.env.SECRET_KEY!
});

export async function POST(request:NextRequest){

    try {
        await dbConnect() 
        
        let { code, email } = await request.json()

    

    let check =   await monoClient.auth.getAccountId({code: "iy88uhihu"})

    if(check === undefined ){
        return NextResponse.json({message:"invalid token"}, status{})
    }

    console.log(data);
    

      return NextResponse.json("hello", {status: 200})

    //     if(err){
    //         throw new Error(err.message);
            
    //     }else{
    //         let user: any = await User?.findOne({email: email}).exec()
    //         if(user === null){

    //             return NextResponse.json({message: "validation error"}, {status:400})
    //         }else{
        
    //             return NextResponse.json({message: "hello"}, { status: 200})
    //         }
    
    //     }

    // .then(async(res) => {

        
       

        // if(user == null){

        //         return NextResponse.json({message: "validation error"}, {status:400})
        // }else{

        //     return NextResponse.json(res, { status: 200})

        //     // user.monoid = res?.data?.id;

        //     // user.save()

        //     // let data =  await monoClient.account.getAccountInformation({accountId: user.monoid});
        // }

            
    // })
    // .catch((err) => console.log(err))

    
    
    } catch (error: any) {
        NextResponse.json({message: error.message})
        console.log(error);
        
    }
    
   
}

export async function GET(request:NextRequest){

    try {
        await dbConnect() 

            let query =  request.nextUrl.searchParams.get("monoid")
      
        if(query !== "" ){
            
            let data =  await monoClient.account.getAccountInformation({accountId: query!});
            console.log(data.responseUrl);
            console.log(data.data);
            

            return NextResponse.json(data.data, {status: 200})
        }
    
    } catch (error: any) {
        NextResponse.json({message: error.message})
        console.log(error);
        
    }
    
   
}