import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ handleMsg }) => {
	const [msg, setMsg] = useState("");
	const send = (e) => {
		e.preventDefault();
		if (msg.length > 0) {
			handleMsg(msg);
			setMsg("");
		}
	};
	return (
		<div className="">
			<form onSubmit={(e) => send(e)} action="">
				<input
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
					className="w-full px-4 py-2 border-none rounded-full outline-none"
					type="text"
					placeholder="Type a message.."
				/>
			</form>
		</div>
	);
};

export default ChatInput;
