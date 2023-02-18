const userModel = require("../Models/UserModel")

const jwt = require("jsonwebtoken")

module.exports.verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) {
                res.json({ verified: false });
                next()
            } else {
                const user = await userModel.findById(decodedToken.id)
                if (user) res.json({ verified: true, user: user.username })
                else res.json({ verified: false })
                next();
            }
        });
    } else {
        res.json({ verified: false });
        next()
    }
}