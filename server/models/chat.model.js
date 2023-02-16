import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    people: {type: Array, required:true},
    messages: {type: Array, required:true}
});

export default mongoose.model("chat", chatSchema);