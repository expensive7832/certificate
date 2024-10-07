import mongoose, { Schema, Document} from "mongoose"

const BankSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true},
    accId: {type: String, required: true},
    currency: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    account_number: {type: String, required: true},
    balance: {type: String, required: true },
    bvn: {type: String, required: true},
    bankname: {type: Date},
    bankcode: {type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
   
},
{ timestamps: true}
)



const Banks = mongoose.models.banks ||  mongoose.model('banks', BankSchema);
export default Banks