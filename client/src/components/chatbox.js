import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/api";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
function Chatbox({ currentChat, currentUser, socket }) {
	const [messages, setMessages] = useState();
	const [arrivalMessage, setArrivalMessage] = useState();
	const scrollRef = useRef();
	useEffect(() => {
		const asd = async () => {
			const response = await axios.post(getAllMessagesRoute, {
				from: currentUser._id,
				to: currentChat._id,
			});
			setMessages(response.data);
		};
		if (currentChat && currentUser) {
			asd();
		}
	}, [currentChat]);
	const get12HourFormat = (date) => {
		let time = new Date(date);
		let hours = time.getHours() % 12 || 12;

		let minutes = time.getMinutes();
		let ampm = time.getHours() > 12 ? "PM" : "AM";
		return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
	};

	const handleMsg = async (msg) => {
		await axios.post(sendMessageRoute, {
			from: currentUser._id,
			to: currentChat._id,
			message: msg,
		});
		socket.current.emit("send-msg", {
			to: currentChat._id,
			from: currentUser._id,
			message: msg,
		});

		const msgs = [...messages];
		msgs.push({ fromSelf: true, message: msg, time: new Date() });
		setMessages(msgs);
	};
	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-receive", (msg) => {
				if (currentChat) {
					if (msg.from === currentChat._id) {
						setArrivalMessage({
							fromSelf: false,
							message: msg.message,
							time: new Date(),
							from: msg.from,
						});
					}
				}
			});
		}
	});

	useEffect(() => {
		if (arrivalMessage) {
			if (currentChat) {
				if (arrivalMessage.from === currentChat._id) {
					setMessages((prev) => [...prev, arrivalMessage]);
				}
			}
		}
	}, [arrivalMessage]);
	useEffect(() => {
		scrollRef.current?.scrollIntoView({});
	}, [messages]);
	return (
		<>
			{currentChat && messages && (
				<div className="relative w-full h-full">
					<div className="sticky top-0 z-20 bg-white shadow-lg p-7 ">
						<p className="font-mono text-xl">{currentChat.username}</p>
					</div>
					<div className="relative w-full h-[81%] overflow-y-scroll chat">
						<div className="flex flex-col p-12 pt-10 pb-10 ">
							{messages.map((e, i) => {
								return (
									<div ref={scrollRef} key={uuidv4()} className="flex flex-col">
										<div
											className={`${
												e.fromSelf
													? "self-end msg fromSelf "
													: "msg notFrom w-max "
											}`}
										>
											<p>{e.message}</p>
										</div>
										<p
											className={`text-[.7rem] text-neutral-400 px-1  ${
												e.fromSelf ? "self-end " : ""
											}`}
										>
											{get12HourFormat(e.time)}
										</p>
									</div>
								);
							})}
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 px-5 py-3  bg-[#333]">
						<ChatInput handleMsg={handleMsg} />
					</div>
				</div>
			)}
		</>
	);
}

export default Chatbox;
