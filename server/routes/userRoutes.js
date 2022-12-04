const {
	register,
	login,
	getAllUsers,
	editUser,
	deleteUser,
} = require("../controller/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:id", getAllUsers);
router.put("/edituser/:id", editUser);
router.delete("/deleteuser/:id", deleteUser);
module.exports = router;
