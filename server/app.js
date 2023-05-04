import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.router.js";
import Sockets from "./routes/socket.router.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => console.log("CONNECTED TO DB!"));

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

const appSession = session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {       
        secure: false,
        expires: 1000 * 60 * 60
    }
});

app.use(appSession); 

app.use("/api/auth", authRoute);

const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
});


io.on("connection", Sockets); 

server.listen(4000, () => console.log("Listening for requests on port 4000"));