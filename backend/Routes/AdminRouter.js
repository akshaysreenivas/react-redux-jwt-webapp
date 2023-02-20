const { getAllUsers, adminLogin,deleteUser, editUser } = require("../Controllers/AdminController");
const { verifyAdmin } = require("../Middlewares/AdminAuth");
const router=require("express").Router();



router.post("/login",adminLogin);

router.post("/getUsers",verifyAdmin,getAllUsers)
router.post("/editUser",verifyAdmin,editUser)
router.post("/deleteUser",verifyAdmin,deleteUser)

module.exports=router;