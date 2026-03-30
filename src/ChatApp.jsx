import React, { useState, useRef, useEffect } from "react";

export default function ChatApp({ userId = "guest" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi 👋 How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // typing simulation
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "This is a smart reply (backend later)" }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div style={styles.fab} onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {/* Chat Window */}
      <div
        style={{
          ...styles.container,
          transform: isOpen ? "scale(1)" : "scale(0)",
          opacity: isOpen ? 1 : 0
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <span>AI Assistant</span>
          <span style={styles.close} onClick={() => setIsOpen(false)}>
            ✖
          </span>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf:
                  msg.type === "user" ? "flex-end" : "flex-start",
                background:
                  msg.type === "user" ? "#DCF8C6" : "#f1f1f1"
              }}
            >
              {msg.text}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputBox}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button style={styles.button} onClick={handleSend}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#138581",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "340px",
    height: "480px",
    background: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    transition: "all 0.3s ease",
    transformOrigin: "bottom right",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
  },
  header: {
    padding: "12px",
    background: "#138581",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold"
  },
  close: {
    cursor: "pointer"
  },
  messages: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    background: "#fafafa"
  },
  message: {
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "75%",
    fontSize: "14px"
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ddd"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none"
  },
  button: {
    padding: "10px 14px",
    background: "#138581",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  typing: {
    display: "flex",
    gap: "4px",
    padding: "6px 10px"
  }
};