const adminModel = require("../Models/AdminModel")

const jwt = require("jsonwebtoken")

module.exports.verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) {
                res.json({ verified: false });
                next()
            } else {
                const admin = await adminModel.findById(decodedToken.id)
                if (admin) res.json({ verified: true, admin: admin.username })
                else res.json({ verified: false })
                next();
            }
        });
    } else {
        res.json({ verified: false });
        next()
    }
}