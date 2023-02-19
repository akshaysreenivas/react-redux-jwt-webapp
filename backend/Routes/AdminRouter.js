const { verify } = require("jsonwebtoken");
const { getAllUsers, adminLogin } = require("../Controllers/AdminController");
const { register, login } = require("../Controllers/AuthController");
const { verifyUser } = require("../Middlewares/UserAuth");

const router=require("express").Router();

router.post("/login",adminLogin);

router.post("/getUsers",getAllUsers)

module.exports=router;