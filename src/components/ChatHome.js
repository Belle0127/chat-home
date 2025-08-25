import React, { useState } from "react";
import "./ChatHome.css";

const ChatHome = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setChat([...chat, { role: "user", content: input }, { role: "assistant", content: data.reply }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>Welcome Home, Belle! 🩵</h1>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <p key={index} className={msg.role}>
            <b>{msg.role === "user" ? "You" : "Chat"}:</b> {msg.content}
          </p>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Start Talking to Me</button>
      </div>
    </div>
  );
};

export default ChatHome;
