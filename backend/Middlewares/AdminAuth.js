
const jwt = require("jsonwebtoken");
const AdminModel = require("../Models/AdminModel");

module.exports.verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({status:false, error: "no token provided" })
    } else {
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) {
                res.json({ status:false, error: "Authentication failed" })
            } else {
                const admin = await AdminModel.findById(decodedToken.id)
                if (admin){
                    next();
                }
                else res.json({ status:false, error: "Authentication failed" })
                
            }
        })
    }

}