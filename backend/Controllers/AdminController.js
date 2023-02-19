const AdminModel = require("../Models/AdminModel");
const UserModel = require("../Models/UserModel");
const jwt =require("jsonwebtoken")


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
        console.log(username,password)
        const admin = await AdminModel.login(username, password);
        const token = createToken(admin._id);
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        });
        res.status(200).json({ user: admin._id, status:true })
    } catch (err) {
        console.log("jdjdjd",err)
        const errors = handleLoginError(err)
        res.json({errors} )
    }
}

const getAllUsers=async(req,res)=>{
    UserModel.find({}).then((docs) => {
        res.send({ success: true, users: docs })
    }).catch((e) => {
        res.send(e)
    })
}


module.exports={
    adminLogin,
    getAllUsers
}