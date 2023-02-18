const UserModel = require("../Models/UserModel");

const jwt = require("jsonwebtoken");


// jwt token creation 

const maxAge = 3 * 24 * 60
const createToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge })
}

// error handling  

const handleSignupErrors = (err) => {
    let errors = { username: "", email: "", password: "", other: "" }
    if (err.code === 11000) {
        errors.email = "Email is already registred"
        return errors
    }

    else if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
        return errors
    }
    else if (err) {
        errors.other = "server error"
        return errors

    }
}


// creating user account  

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, } = req.body;
        const user = await UserModel.create({ username, email, password });
        const token = createToken(user._id);

        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        });
        res.status(201).json({ user: user._id, created: true })

    } catch (err) {
        console.log(err)
        const errors = handleSignupErrors(err)
        res.json({ errors, created: false })


    }
};

// user login   
const handleLoginError = (err) => {
    let errors = ""
    if (err.message.length > 0) {
        errors = err.message
        return errors
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { email, password, } = req.body;
        const user = await UserModel.login(email, password);
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
};