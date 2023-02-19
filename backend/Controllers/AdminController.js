const AdminModel = require("../Models/AdminModel");
const UserModel = require("../Models/UserModel");





const adminLogin= async(req,res)=>{
    try {
        const { username, password, } = req.body;
        const user = await AdminModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        });
        res.status(200).json({ user: user._id, loggedIn: true })
    } catch (err) {
        const errors = handleLoginError(err)
        res.json({ errors, loggedIn: false })
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