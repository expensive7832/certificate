import mongoose, { Schema, Document} from "mongoose"

// export interface Iusers extends Document{

//     fname: string,
//     lname: string,
//     email: string,
//     password: string,
//     address: string,
//     state: string,
//     code: string,
//     dob: Date,
//     identity: string
   
// }

const userSchema: Schema = new mongoose.Schema({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    state: {type: String, required: true },
    code: {type: String, required: true},
    dob: {type: Date},
    identity: {type: String, required: true},
   
},
{ timestamps: true}
)



const User = mongoose.models.users ||  mongoose.model('users', userSchema);
export default User