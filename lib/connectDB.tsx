import mongoose from "mongoose";

const connection: { isConnected?: number} = {}


async function dbConnect(){
    if(connection.isConnected){
        return;
    }

    await mongoose.connect(process.env.MONGO_URI!)
    .then((db)=> {
    
        connection.isConnected = db.connections[0]?.readyState
    })
    .catch((err) =>{
        console.log(err);
        
    })

}

try{
    dbConnect();

}catch(err){
    console.log(err);
    
}


export default dbConnect