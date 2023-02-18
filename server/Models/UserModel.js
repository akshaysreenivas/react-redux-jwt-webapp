const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name required"],

    },
    email: {
        type: String,
        required: [true, "Email field required"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicURL: {
        type: String,
    },
});

userSchema.pre("save", async function (next) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error)
    }

});

userSchema.statics.login = async function (email, password) {
    try {
        if (!email) throw Error("email required")
        if (!password) throw Error("password required")
        const user = await this.findOne({ email })
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user
            } else {
                throw Error("incorrect password")
            }
        } else {
            throw Error("invalid email")
        }
    } catch (err) {
        throw err
    }
}


//Export the model
module.exports = mongoose.model('Users', userSchema);