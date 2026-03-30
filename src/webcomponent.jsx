// ✅ Fix for process issue (browser safe)
// ✅ MUST be first line
if (typeof window !== "undefined" && !window.process) {
  window.process = { env: { NODE_ENV: "production" } };
}
import React from "react";
import { createRoot } from "react-dom/client";
import ChatApp from "./ChatApp";

class ChatBotElement extends HTMLElement {
  connectedCallback() {
    const userId = this.getAttribute("user-id") || "guest";

    // Create Shadow DOM (isolated styles)
    const shadow = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    shadow.appendChild(container);

    // Mount React app
    createRoot(container).render(<ChatApp userId={userId} />);
  }
}

// Register custom element
customElements.define("chat-bot", ChatBotElement);