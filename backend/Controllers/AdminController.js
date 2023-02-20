const AdminModel = require("../Models/AdminModel");
const UserModel = require("../Models/UserModel");
const jwt =require("jsonwebtoken");
const { default: mongoose } = require("mongoose");


//  creating token for admin 

const maxAge=3*24*60
const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_KEY,{expiresIn:maxAge})
}





const handleLoginError=(err)=>{
    let errors={status:false,error:""}
  return  errors.error=err.message
}


const adminLogin= async(req,res)=>{
    try {
        const { username, password, } = req.body;
        const admin = await AdminModel.login(username, password);
        const token = createToken(admin._id);
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        });
        res.status(200).json({ user: admin._id, status:true })
    } catch (err) {
        const errors = handleLoginError(err)
        res.json({errors} )
    }
}

const getAllUsers=async(req,res)=>{
    UserModel.find({},{password:0}).lean().then((docs) => {
        res.status(200).json({ status: true, users: docs })
    }).catch((err) => {
        res.send(err)
    })
}
const editUser=async(req,res)=>{

    const { userId,username,email} =req.body
    const userID = new mongoose.Types.ObjectId(userId)
    UserModel.findByIdAndUpdate(userID,{$set:{username:username,email:email}},{new:true}).lean().then((docs)=>{
        res.status(200).json({ status: true, users: docs })
    }).catch((err) => {
        res.send(err)
    })
}
const deleteUser= async(req,res)=>{
    const {userId}=req.body
    UserModel.findByIdAndDelete(userId).then((docs) => {
        res.status(200).json({ status: true ,deleted:docs})
    }).catch((err) => {
        res.send(err)
    })
}


module.exports={
    adminLogin,
    getAllUsers,
    editUser,
    deleteUser
}