import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
    const { username, email, password, birthMonth, birthDay, birthYear } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(403).json({error: "Account already registered please Login"});

    try {
        if(!username || !email || !password || !birthMonth || !birthDay || !birthDay) return res.status(400).json({error: "Please fill in all fields."});
        if(username.length > 17) return res.status(400).json({error: "Username has a maximum length of 16 characters"}) 
        if(password.length < 6) return res.status(400).json({error: "password must have a minimum length of 6 characters"});
        if(!validator.isEmail(email)) return res.status(400).json({error: "Please insert a valid email"});
        if(typeof birthDay !== "number" || typeof birthYear !== "number" || birthMonth == "Month") return res.status(400).json({error: "Please enter a valid date"});

        if(birthDay > 31 || birthDay < 1) return res.status(400).json({error: "Invalid date"});
        if(birthYear > 2022 || birthYear < 2000) return res.status(400).json({error: "Invalid date"}); 

        const passwordHash = await bcrypt.hash(password, 10);
        const userHash = Math.floor(Math.random() * 9000 + 1000); 
        const user = await User.create({ username, email, password:passwordHash, birthMonth, birthDay, birthYear, userHash });
    
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({error: "Please fill in all fields"});
    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({error: "Login or Password is invalid"});

    try {
        const confirmPassword = await bcrypt.compare(password, user.password);
        if(!confirmPassword) return res.status(400).json({error: "Login or Password is invalid"});

        const newUser = {username: user.username, email: user.email, birthDay: user.birthDay, birthMonth: user.birthMonth, birthYear: user.birthYear, profilePic: user.profilePic, hash:user.userHash, pendingFriends: user.pendingFriends, acceptedFriends: user.acceptedFriends, blockedFriends: user.blockedFriends, _id: user._id};

        req.session.loggedIn = true;
        req.session.user = user;

        return res.status(200).json(newUser);   
    }
    catch (error) {
        res.status(500).json(error);
    }
}   

export const SendResetPassword = async (req, res) => {
    const { email } = req.body;
    if(req.session && req.session.loggedIn) return;

    if(!email) return res.status(400).json({error: "This field is required"})

    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({error: "Email does not exist"});

    const token = jwt.sign({ name: user.username, email: email }, process.env.JWT_SECRET, {expiresIn: "5m"});
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

    let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "discordmern@gmail.com",
            pass: "fmttdkzjqzmtofsh"
        },
        port:465
    })

    let details = {
        from: "Discord",
        to: email,
        subject: "Password Reset Request for Discord",
        html: `
            <p style="font-size:20px">Hey ${user.username},</p>
            <p style="font-size:14px">Your Discord password can be reset by clicking the button below. If you did not request a new password, please ignore this email.</p>
            <a href=${link}>Reset Password</a>
        `
    }

    transport.sendMail(details, (err) => {
        if(err) return console.log(err);
        console.log("Email has been sent successfully");
    })
}

export const ValidateToken = async (req, res) => {
    const { token, id } = req.body;

    if(!token) return;
    if(!id) return;
    
    const user = await User.findOne({ _id: id });
    if(!user) return;
        
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json("success");
    }
    catch (err) {
        res.status(500).json(err)
    }
}

export const ResetPassword = async (req, res) => {
    const { id, newPassword } = req.body;

    if(!id) return;
    if(!newPassword) return;
    if(newPassword.length < 6) return res.status(400).json({error: "Must be 6 or more in length"});

    const user = await User.findOne({ _id: id });
    if(!user) return;

    try {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await user.updateOne({ $set: { password: newHashedPassword } });
        res.status(200).json("password changed successfully!");
    }
    catch (err) {
        res.status(500).json(err);
    }

}

export const GetCurrentUser = async (req, res) => {
    if(req.session.loggedIn && req.session.user) {
        const { _id, username, email, birthDay, birthMonth, birthYear, profilePic, userHash, pendingFriends, acceptedFriends, blockedFriends } = req.session.user;
        
        res.status(200).json({username, email, birthDay, birthYear, birthMonth, _id, profilePic, hash:userHash, pendingFriends, acceptedFriends, blockedFriends});
    }
    else {
        res.status(400).json({user:null})
    }
}

export const Logout = async (req, res) => {
    req.session.destroy();
}