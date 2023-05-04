import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    username: {type: String, required:true},
    profilePic: {type: String, required:true},
    text: {type:String},
    showOnlyMessage: {type:Boolean, required:true},
    image: {type: String},
    senderId: {type:String, required: true},
    createdAt: {type:String, required:true},
    chatId: {type:String, required:true},
});

export default mongoose.model("messages", messageSchema);