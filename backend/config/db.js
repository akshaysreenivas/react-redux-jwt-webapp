const mongoose =require("mongoose")
const db= async()=>{
    try{
        mongoose.set('strictQuery', false)
        mongoose.connect("mongodb://127.0.0.1:27017/jwtapp",{
           useNewUrlParser:true,
           useUnifiedTopology:true
       }).then(()=>console.log("Database Connected successfully"))
       .catch((err)=>console.log("error connecting",err))
    }catch(err){
        console.log("error connecting",err)
    }
}


module.exports=db