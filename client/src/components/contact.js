import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillEdit } from "react-icons/ai";
import { CgLogOut } from "react-icons/cg";
function Contact({ contacts, currUser, change, notifs, setNotifs }) {
	const [currUsername, setCurrUsername] = useState();
	const [selected, setSelected] = useState();
	const selectChat = (i, contact) => {
		setSelected(i);
		if (i >= 0) localStorage.setItem("selectedIndex", i);
		change(contact);
		if (contact) setNotifs(notifs.filter((e) => e.from !== contact._id));
		localStorage.setItem("current-contact", JSON.stringify(contact));
	};

	useEffect(() => {
		if (currUser) {
			setCurrUsername(currUser.username);
			if (
				!localStorage.getItem("current-chat") &&
				!localStorage.getItem("selectedIndex") &&
				!localStorage.getItem("current-contact")
			) {
				selectChat(0, contacts[0]);
			} else
				selectChat(
					parseInt(localStorage.getItem("selectedIndex")),
					JSON.parse(localStorage.getItem("current-contact"))
				);
		}
	}, [currUser]);
	const navigate = useNavigate();

	return (
		<>
			{currUsername && (
				<div className="bg-[#333] h-full w-[25%] flex flex-col justify-between relative   overflow-auto  contacts ">
					<p
						style={{ textShadow: "2px 2px 2px #0000003e" }}
						className="sticky top-0 flex justify-center py-5 text-xl font-black text-white bg-gradient-to-r from-neutral-500 to-neutral-800"
					>
						bo chat app
					</p>
					<div className="flex flex-col h-full gap-2 p-5 pb-20 overflow-y-scroll contacts">
						{contacts.map((e, i) => {
							let counter = 0;
							return (
								<div
									key={e._id}
									onClick={() => selectChat(i, e)}
									className={`contact  rounded-md text-sm cursor-pointer transition duration-500 overflow-hidden  ${
										i === selected
											? "selected bg-[#c6c6c6] text-black"
											: "hover:bg-[#5d5d5d] bg-[#414141] text-white"
									}  p-5 font-mono relative flex items-center`}
								>
									<p>{e.username}</p>
									{notifs
										? notifs.map((notif) => {
												if (notif.from === e._id) {
													counter++;
												}
										  })
										: ""}
									{counter > 0 && (
										<motion.div className="absolute right-3 top-4 font-semibold w-6 h-6 justify-center flex items-center text-xs rounded-[100%] bg-[#ff4e4e] ">
											{counter}
										</motion.div>
									)}
								</div>
							);
						})}
					</div>

					<div className="flex items-center justify-between p-3 font-mono font-semibold text-black align-bottom bg-yellow-300 self-bottom">
						<div className="flex items-center gap-3 ">
							<p> {currUsername}</p>
							<div
								onClick={() => navigate("/edit")}
								className="transition duration-300 cursor-pointer hover:opacity-75"
							>
								<AiFillEdit />
							</div>
						</div>
						<p
							onClick={() => {
								localStorage.removeItem("chat-app-user");
								navigate("/login");
							}}
							className="text-2xl transition duration-500 cursor-pointer hover:opacity-70"
						>
							<CgLogOut />
						</p>
					</div>
				</div>
			)}
		</>
	);
}

export default Contact;
