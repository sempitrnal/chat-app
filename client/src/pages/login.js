import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { loginRoute } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
const Signup = () => {
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [userValid, setUValid] = useState(true);
	const [passwordMatch, setPWMatch] = useState(true);
	const [pwShow, setPwShow] = useState(false);

	const router = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { username, email, password } = data;
		if (userValid && passwordMatch && data.username.length > 0) {
			console.log("asd", loginRoute);
			const { data } = await axios.post(loginRoute, {
				username,
				password,
			});
			if (data.status === false) {
				toast.error(data.msg);
			}
			if (data.status === true) {
				localStorage.setItem("chat-app-user", JSON.stringify(data.user));
				router("/home");
			}
		} else if (data.username === "") {
			setUValid(false);
		}
	};

	const changeHandler = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
	};
	useEffect(() => {
		if (data.username.length < 5 && data.username.length > 0) setUValid(false);
		else setUValid(true);
		if (
			data.password !== data.confirmPassword &&
			data.confirmPassword.length > 0
		)
			setPWMatch(false);
		else setPWMatch(true);
	}, [data]);
	return (
		<motion.div
			initial={{ x: 1000, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -1000, opacity: 0 }}
			transition={{ type: "spring", damping: 20, stiffness: 100 }}
			className="flex items-center justify-center h-screen"
		>
			<Toaster />
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="flex flex-col gap-5 login"
			>
				<div className="relative flex flex-col gap-1 ">
					<label htmlFor="username">Username</label>
					<input
						autoComplete="off"
						onChange={changeHandler}
						type="text"
						id="username"
						name="username"
						className={`${
							!userValid
								? "ring-red-400 focus:ring-red-400"
								: " focus:ring-[#caa9ff] ring-[#989898] "
						}`}
					/>
					{!userValid && (
						<p className="absolute text-xs text-red-500 bottom-[-20px]">
							Enter username
						</p>
					)}
				</div>

				<div className="relative flex flex-col gap-1">
					{" "}
					<label htmlFor="password">Password</label>
					<input
						autoComplete="off"
						onChange={changeHandler}
						type={pwShow ? "text" : "password"}
						id="password"
						name="password"
					/>
					<div
						onClick={() => setPwShow(!pwShow)}
						className="absolute text-lg transition-opacity cursor-pointer bottom-3 right-3 hover:opacity-80"
					>
						{pwShow ? <AiFillEyeInvisible /> : <AiFillEye />}
					</div>
				</div>

				<button className="px-3 py-2 my-5 bg-[#333] text-white rounded-md font-semibold flex justify-center">
					Sign in
				</button>
				<p className="flex items-center justify-center w-full gap-2 font-mono text-xs">
					dont have an account?{" "}
					<span
						onClick={() => router("/signup")}
						className="cursor-pointer hover:opacity-75 transition-opacity text-[#8559ad]"
					>
						{" "}
						sign up
					</span>
				</p>
			</form>
		</motion.div>
	);
};

export default Signup;
