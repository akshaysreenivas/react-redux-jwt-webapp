const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser=require("cookie-parser")
const adminRouter=require("./Routes/AdminRouter")
const userRouter=require("./Routes/UserRouter")
const dataBase =require("./config/db")
const path = require('path');

require('dotenv').config()

// starting server  

// connecting mongodb 
dataBase()


app.use(cors({ origin: [process.env.CORS_ORIGIN], methods: ["GET", "POST"], credentials: true, }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/",userRouter)
app.use("/admin",adminRouter)


const port = 5000;
app.listen(port, () => console.log("server started on PORT", port));