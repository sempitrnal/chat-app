import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { deleteUserRoute, editUserRoute } from "../utils/api";
import { BsFillTrashFill } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
const EditAccount = () => {
	const navigate = useNavigate();
	const [currUser, setCurrUser] = useState();
	const [edit, isEdit] = useState(false);
	const [deletePrompt, isPrompt] = useState(false);
	const [values, setValues] = useState({
		username: "",
		email: "",
	});
	useEffect(() => {
		const set = async () => {
			setCurrUser(await JSON.parse(localStorage.getItem("chat-app-user")));
		};
		if (!localStorage.getItem("chat-app-user")) {
			navigate("/login");
		} else {
			set();
		}
	}, []);
	console.log(currUser);
	const updateUser = async () => {
		const { username, email, _id } = values;
		const data = await axios
			.put(`${editUserRoute}/${currUser._id}`, {
				_id,
				username,
				email,
			})
			.then((data) => {
				if ((data.status = 200)) {
					toast.success("User successfully updated!");
					setCurrUser({ ...currUser, username: username, email: email });
				}
				localStorage.removeItem("chat-app-user");
				localStorage.setItem(
					"chat-app-user",
					JSON.stringify({ ...currUser, username: username, email: email })
				);
				isEdit(false);
			})
			.catch((e) => console.log(e));
	};
	const deleteHandler = async () => {
		const data = await axios.delete(`${deleteUserRoute}/${currUser._id}`);
		if (data.status === 200) {
			toast.success("User successfully deleted! Redirecting to login page...");

			localStorage.removeItem("chat-app-user");
			setTimeout(() => {
				navigate("/login");
			}, 800);
		}
	};
	const changeHandler = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};
	return (
		<>
			{currUser && (
				<div>
					<Toaster />
					<div className="flex items-center justify-center h-screen">
						<div
							transition={{
								type: "spring",
								damping: 20,
								stiffness: 100,
								delay: 0.3,
							}}
							className="h-[80%] w-full md:w-[90%] flex flex-col shadow-2xl border rounded-lg overflow-hidden"
						>
							<p className="flex font-mono text-xl font-semibold bg-yellow-300 p-7">
								{currUser.username}
							</p>
							<div className="mx-5 mt-8 text-lg transition-opacity cursor-pointer w-max hover:opacity-80">
								<p onClick={() => navigate("/home")}> {`<-`} Back</p>
							</div>
							{!edit ? (
								<div className="flex flex-col gap-5 p-5 mx-5 my-10 overflow-hidden border rounded-md">
									<div className="flex gap-5">
										<p className="font-semibold w-[5rem]">Username</p>
										<p>{currUser.username}</p>
									</div>
									<div className="flex gap-5">
										<p className="font-semibold w-[5rem]">E-mail</p>
										<p>{currUser.email}</p>
									</div>
								</div>
							) : (
								<div className="relative flex flex-col gap-5 p-5 mx-5 my-10 border rounded-md edit">
									<div
										onClick={() => {
											isPrompt(!deletePrompt);
										}}
										className="absolute p-1 text-xl text-red-600 rounded-md cursor-pointer bottom-2 right-2 bg-neutral-100 hover:opacity-90"
									>
										<BsFillTrashFill />
									</div>
									<AnimatePresence>
										{deletePrompt && (
											<motion.div
												onClick={(e) => e.stopPropagation()}
												initial={{ scale: 0, opacity: 0, x: 100, y: 30 }}
												animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
												exit={{ scale: 0, opacity: 0, x: 100, y: 30 }}
												transition={{ duration: 0.3 }}
												className="absolute right-0 p-5 text-sm bg-white rounded-md shadow-lg w-max"
											>
												<p className="mb-5 text-black">
													are u sure u want to delete this user?
												</p>
												<div className="flex justify-end gap-2">
													<button
														onClick={deleteHandler}
														className="px-3 cursor-pointer hover:opacity-80 transition-opacity text-white bg-[#ff6b6b] w-max rounded-[.2rem]"
													>
														Yes
													</button>
													<button
														onClick={() => isPrompt(false)}
														className="px-3 py-1 text-black w-max hover:opacity-80 transition-opacity bg-[#c6c6c675] rounded-[.2rem]"
													>
														Cancel
													</button>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
									<div className="flex items-center gap-5">
										<p className="font-semibold w-[5rem]">Username</p>
										<input
											value={values.username}
											onChange={changeHandler}
											name="username"
											type="text"
											placeholder={currUser.username}
										/>
									</div>
									<div className="flex gap-5">
										<p className="font-semibold w-[5rem]">E-mail</p>
										<input
											value={values.email}
											onChange={changeHandler}
											name="email"
											type="text"
											placeholder={currUser.email}
										/>
									</div>
								</div>
							)}

							{!edit ? (
								<button
									onClick={() => isEdit(!edit)}
									className="px-5 py-1 mx-5 bg-green-300 rounded-md w-max"
								>
									Edit
								</button>
							) : (
								<div className="flex gap-3 mx-5">
									<button
										onClick={() => isEdit(!edit)}
										className="px-5 py-1 rounded-md bg-neutral-300 w-max"
									>
										Cancel
									</button>
									<button
										onClick={updateUser}
										className="px-5 py-1 bg-blue-300 rounded-md w-max"
									>
										Save
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EditAccount;
