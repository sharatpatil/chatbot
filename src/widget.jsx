// src/widget.js
// ✅ MUST be first line
if (typeof window !== "undefined" && !window.process) {
  window.process = { env: { NODE_ENV: "production" } };
}

import { createRoot } from "react-dom/client";
import ChatApp from "./ChatApp";

const ChatbotGlobal = {
  init: ({ userId }) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    createRoot(container).render(<ChatApp userId={userId} />);
  },
};

window.Chatbot = ChatbotGlobal;

export default ChatbotGlobal;