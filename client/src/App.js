import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Chat from "./pages/chat";
import { AnimatePresence } from "framer-motion";
import EditAccount from "./pages/editAccount";
function App() {
	const loc = useLocation();
	const [user, setUser] = useState();
	useEffect(() => {
		if (localStorage.getItem("chat-app-user")) {
			setUser(JSON.parse(localStorage.getItem("chat-app-user")));
		}
	}, []);
	return (
		<div className="overflow-hidden App">
			<AnimatePresence>
				<Routes key={loc.pathname}>
					<Route path="/signup" element={<Signup />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route path="/home" element={<Chat />}></Route>
					<Route path="/edit" element={<EditAccount />}></Route>
					<Route
						path="/"
						element={user ? <Navigate to={"/home"} /> : <Login />}
					></Route>
				</Routes>
			</AnimatePresence>
		</div>
	);
}

export default App;
