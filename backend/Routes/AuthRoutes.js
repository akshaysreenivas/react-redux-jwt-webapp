const { register, login } = require("../Controllers/AuthController");
const { verifyUser } = require("../Middlewares/UserAuthMiddleware");

const router=require("express").Router();




router.post("/",verifyUser)
router.post("/register",register);
router.post("/login",login);



module.exports=router;