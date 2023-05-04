import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {type:String, required:true},
    username: {type:String, required:true},
    password: {type:String, required:true, min:6},
    birthMonth: {type:String, required:true},
    birthDay: {type:Number, required:true},
    birthYear: {type:Number, required:true},
    profilePic: {type:String, required:true, default:"https://ia803204.us.archive.org/4/items/discordprofilepictures/discordblue.png"},
    userHash: {type:String, required:true,},
    pendingFriends: {type: Array, required: true},
    pendingGroups: {type: Array, required: true},
    blockedFriends: {type:Array, required:true},
    acceptedFriends: {type:Array, required:true},
    groups: {type:Array, required:true}
});

export default mongoose.model("Users", UserSchema);