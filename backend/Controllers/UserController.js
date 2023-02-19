const { default: mongoose } = require("mongoose");
const UserModel = require("../Models/UserModel")
const jwt = require("jsonwebtoken")
const fs=require("fs")



const getProfile = async (req, res) => {
    try {
        const ID = req.body.userId
        const user = await UserModel.findById(ID)
        if (!user) res.status(401).json({ status: false, error: "No User Found" });
        else res.status(200).json({ status: true, userName: user.username, profileUrl: user.profilePicURL })
    } catch (error) {
        res.status(500).json({ error: "Something went wrong " })
    }

}



//  function for returning a formatted error
const handleError = (err) => {
    let errors={status :false,error:""}
     if (err.message.includes("invalid extension")) {
       errors.error="invalid  file extension type"
        return errors
    }
    errors.error="Something went wrong"

};







const updateProfile = async (req, res,next) => {
    try {
       if(!req.body.fileupload){
        throw Error("invalid extension")
       }
       const filePath = `public/${req.body.profileUrl}`

        if(req.body.profileUrl){
            fs.unlinkSync(filePath, (err => {
                if (err)throw Error(err)
              }));
        }
        const token = req.cookies.jwt;
        const decoded = jwt.decode(token, process.env.JWT_KEY, { complete: true })
        const imgUrl = "/images/" + req.file.filename
        const userId = new mongoose.Types.ObjectId(decoded.id)
        await UserModel.findByIdAndUpdate(userId, { $set: { profilePicURL: imgUrl } },{new:true}).then((user) => {
            res.status(201).json({ status: true, message: "Profile pic uploaded successfully",profileUrl: user.profilePicURL })
        }).catch((error) => {
            res.json({ status:false, error: "Something went wrong " })
        })
    } catch (error) {
        const errors = handleError(error)
        res.json( errors )
    }
}

module.exports = {
    getProfile,
    updateProfile
}