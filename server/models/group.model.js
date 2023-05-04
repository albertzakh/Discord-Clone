import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {type:String, required:true},
    members: {type: Array, required:true},
    creator: {type: String, required:true}
});

export default mongoose.model("group", groupSchema);