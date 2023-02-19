const userModel = require("../Models/UserModel")

const jwt = require("jsonwebtoken")

module.exports.verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({status:false, error: "no token provided" })
    } else {
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) {
                res.json({ status:false, error: "Authentication failed" })
            } else {
                const user = await userModel.findById(decodedToken.id)
                if (user){
                    req.body.userId = decodedToken.id
                    next();
                }
                else res.json({ status:false, error: "Authentication failed" })
                
            }
        })
    }

}