import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("chat message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit("chat message", message);
        setMessage("");
    };

    return (
        <div>
            <h2>Chat en Vivo</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Chat;
