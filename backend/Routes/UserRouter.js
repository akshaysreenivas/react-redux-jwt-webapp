const router=require("express").Router();
const { register, login } = require("../Controllers/AuthController");
const { updateProfile, getProfile } = require("../Controllers/UserController");
const upload = require("../Middlewares/ImageUpload");
const { verifyUser } = require("../Middlewares/UserAuth");



router.post("/",verifyUser,getProfile)
router.post("/register",register);
router.post("/login",login);
router.post("/upload_image",verifyUser,upload.single("image"),updateProfile);



module.exports=router;