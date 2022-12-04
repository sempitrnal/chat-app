import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { registerRoute } from "../utils/api";
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
	const [cpwShow, setCpwShow] = useState(false);
	const router = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { username, email, password } = data;
		if (userValid && passwordMatch && data.username.length > 0) {
			console.log("asd", registerRoute);
			const { data } = await axios.post(registerRoute, {
				username,
				email,
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
				className="flex flex-col gap-5 signup"
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
							username should have 5 or more characters
						</p>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="email">Email</label>
					<input
						autoComplete="off"
						onChange={changeHandler}
						type="email"
						id="email"
						name="email"
					/>
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
						className={`${
							data.password.length > 0 && data.password.length < 8
								? "ring-red-400 focus:ring-red-400"
								: " focus:ring-[#caa9ff] ring-[#989898] "
						}`}
					/>
					<div
						onClick={() => setPwShow(!pwShow)}
						className="absolute text-lg transition-opacity cursor-pointer bottom-3 right-3 hover:opacity-80"
					>
						{pwShow ? <AiFillEyeInvisible /> : <AiFillEye />}
					</div>
					{data.password.length > 0 && data.password.length < 8 && (
						<p className="absolute bottom-[-25px] text-xs text-red-500">
							passwords should have 8 or more characters
						</p>
					)}
				</div>
				<div className="relative flex flex-col gap-1">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						className={`${
							!passwordMatch
								? "ring-red-400 focus:ring-red-400"
								: " focus:ring-[#caa9ff] ring-[#989898] "
						}`}
						autoComplete="off"
						onChange={changeHandler}
						type={cpwShow ? "text" : "password"}
						id="confirmPassword"
						name="confirmPassword"
					/>
					<div
						onClick={() => setCpwShow(!cpwShow)}
						className="absolute text-lg transition-opacity cursor-pointer bottom-3 right-3 hover:opacity-80"
					>
						{cpwShow ? <AiFillEyeInvisible /> : <AiFillEye />}
					</div>
					{!passwordMatch && (
						<p className="absolute bottom-[-25px] text-xs text-red-500">
							passwords should match
						</p>
					)}
				</div>

				<button className="px-3 py-2 my-5 bg-[#333] text-white rounded-md font-semibold flex justify-center">
					Sign up
				</button>
				<p className="flex items-center justify-center w-full gap-2 font-mono text-xs">
					already have an account?{" "}
					<span
						onClick={() => router("/login")}
						className="cursor-pointer hover:opacity-75 transition-opacity text-[#8559ad]"
					>
						{" "}
						sign in
					</span>
				</p>
			</form>
		</motion.div>
	);
};

export default Signup;
