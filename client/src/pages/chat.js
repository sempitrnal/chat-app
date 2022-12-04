import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/api";
import { motion } from "framer-motion";
import Contact from "../components/contact";
import Chatbox from "../components/chatbox";
import { io } from "socket.io-client";

const Chat = () => {
	const navigate = useNavigate();
	const socket = useRef();
	const [notifs, setNotifs] = useState([]);
	const [notif, setNotif] = useState();
	const [contacts, setContacts] = useState([]);
	const [currUser, setCurrUser] = useState();
	const [currChat, setCurrChat] = useState();

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
	useEffect(() => {
		if (currUser) {
			socket.current = io(host);
			socket.current.emit("add-user", currUser._id);
		}
	}, [currUser]);
	useEffect(() => {
		const set = async () => {
			const data = await axios.get(`${allUsersRoute}/${currUser._id}`);
			setContacts(data.data);
		};
		if (currUser) {
			set();
		}
	}, [currUser]);

	useEffect(() => {
		if (!localStorage.getItem("current-chat")) setCurrChat(contacts[0]);
		else setCurrChat(JSON.parse(localStorage.getItem("current-chat")));
	}, [contacts]);
	const changeChatHandler = (chat) => {
		setCurrChat(chat);
		if (chat) localStorage.setItem("current-chat", JSON.stringify(chat));
	};
	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-receive", (msg) => {
				console.log(msg);
				setNotif({
					fromSelf: false,
					message: msg.message,
					time: new Date(),
					from: msg.from,
				});
			});
		}
	});
	useEffect(() => {
		if (notif) {
			if (currChat._id !== notif.from) {
				setNotifs((prev) => [...prev, notif]);
			}
		}
	}, [notif]);
	console.log(notifs);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex items-center justify-center h-screen"
		>
			<motion.div
				animate={{ opacity: 1, x: 0 }}
				transition={{ type: "spring", damping: 20, stiffness: 100 }}
				className="h-[90%] w-full md:w-[90%] flex shadow-2xl border rounded-lg overflow-hidden"
			>
				<Contact
					notifs={notifs}
					setNotifs={setNotifs}
					contacts={contacts}
					currUser={currUser}
					change={changeChatHandler}
				/>

				<Chatbox
					socket={socket}
					currentUser={currUser}
					currentChat={currChat}
				/>
			</motion.div>
		</motion.div>
	);
};

export default Chat;
