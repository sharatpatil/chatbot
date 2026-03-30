// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import ChatApp from "./ChatApp";
import Chatbot from "./Chatbot";

createRoot(document.getElementById("root")).render(
  // <ChatApp userId="local-user" />
  <Chatbot userId="local-user" />
);