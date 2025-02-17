import mongoose, { Schema, Types } from "mongoose"
import { User } from "./user.model"
import { seller } from "./admin.model"

const categoriesSchema = new Schema

(
{
    name: 
    {
        type:String,
        required:true
    }
    
}
,{timestamps:true}
)



export const categories = mongoose.model("categories", categoriesSchema)