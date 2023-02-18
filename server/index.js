const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes=require("./Routes/AuthRoutes")
const mongoose =require("mongoose")
const cookieParser=require("cookie-parser")

// starting server  
const port = 5000;
app.listen(port, () => console.log("serverstarted on PORT", port));

// connecting mongodb 
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/jwtapp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("Database Connected successfully"))


.catch((err)=>console.log("error connecting",err))


app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use("/",authRoutes)