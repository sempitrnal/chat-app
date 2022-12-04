const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const objectid = require("mongodb").ObjectId;
module.exports.register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		const usernameCheck = await User.findOne({ username });
		if (usernameCheck) return res.json({ msg: "Username used", status: false });
		const emailCheck = await User.findOne({ email });
		if (emailCheck) return res.json({ msg: "Email used", status: false });

		const hash = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			username,
			password: hash,
		});
		delete user.password;
		return res.json({ status: true, user });
	} catch (e) {
		next(e);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user)
			return res.json({ msg: "Incorrect username or password", status: false });
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid)
			return res.json({ msg: "Incorrect username or password", status: false });

		delete user.password;
		return res.json({ status: true, user });
	} catch (e) {
		next(e);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ _id: { $ne: req.params.id } }).select([
			"email",
			"username",
			"_id",
		]);
		return res.json(users);
	} catch (error) {
		next(error);
	}
};
module.exports.editUser = async (req, res, next) => {
	const { username, email, id } = req.body;
	console.log(username);
	console.log(req.params.id);
	try {
		const update = await User.updateOne(
			{ _id: objectid(req.params.id) },
			{
				$set: {
					username: username,
					email: email,
				},
			}
		);

		console.log(update);
		return res.json(update);
	} catch (error) {
		next(error);
	}
};

module.exports.deleteUser = async (req, res, next) => {
	try {
		const asd = await User.deleteOne({
			_id: req.params.id,
		});
		return res.json(asd);
	} catch (error) {
		next(error);
	}
};
