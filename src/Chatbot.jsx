import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const CONTEXTS = [
  'Executive Summary Details',
  'Client Objectives',
  'Solution Overview',
  'RFP Questionnaires',
  'Project Information',
];

const BOT_REPLIES = [
  "Based on the client's profile, I recommend emphasising cost reduction and operational efficiency in the executive summary. Would you like me to draft a specific section?",
  'I found 3 relevant case studies for this RFP type. The most applicable one is the APAC Cash Management deployment from Q2 2024. Shall I apply those details?',
  'For the solution overview, consider highlighting your multi-currency pooling capabilities and real-time visibility features. These align well with the stated client objectives.',
  "I've analysed the RFP requirements. The key differentiators to mention are: automated liquidity management, AI-driven FX hedging, and 24/7 support across 12 markets.",
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "Hello! I'm your Client Adviser AI assistant for this RFP flow. I can help you refine and suggest content, or answer questions about the RFP flow.",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [contextIndex, setContextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [likedMessages, setLikedMessages] = useState(new Set());
  const [dislikedMessages, setDislikedMessages] = useState(new Set());
  const [replyIndex, setReplyIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    const trimmedText = inputValue.trim();
    if (!trimmedText) return;

    const newMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: trimmedText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMessage = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        text: BOT_REPLIES[replyIndex % BOT_REPLIES.length],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setReplyIndex((prev) => prev + 1);
    }, 1400);
  };

  const cycleContext = () => {
    setContextIndex((prev) => (prev + 1) % CONTEXTS.length);
  };

  const toggleLike = (messageId) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const toggleDislike = (messageId) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const toggleConfidence = () => {
    alert('Confidence breakdown: Matched 4 verified sources · High relevance score');
  };

  const toggleHistory = () => {
    alert('Chat history: 3 previous sessions available');
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const closeChat = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'AI_CHAT_CLOSE' }, '*');
    }
    console.log('Close chat');
  };

  const regenerate = () => {
    const botMessages = messages.filter((m) => m.type === 'bot');
    if (botMessages.length > 0) {
      setMessages((prev) => prev.slice(0, -1));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMessage = {
          id: `bot_${Date.now()}`,
          type: 'bot',
          text: BOT_REPLIES[replyIndex % BOT_REPLIES.length],
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setReplyIndex((prev) => prev + 1);
      }, 1200);
    }
  };

  const copyMessage = () => {
    const botMessages = messages.filter((m) => m.type === 'bot');
    if (botMessages.length > 0) {
      const lastMessage = botMessages[botMessages.length - 1];
      navigator.clipboard?.writeText(lastMessage.text).catch(() => {});
    }
  };

  const exportMessage = () => {
    alert('Message exported to clipboard');
  };

  const attachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const userMsg = {
          id: `user_${Date.now()}`,
          type: 'user',
          text: `📎 Attached: ${file.name}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const botMsg = {
            id: `bot_${Date.now()}`,
            type: 'bot',
            text: `I've received "${file.name}". I'll analyse it and extract relevant RFP details. Give me a moment…`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, botMsg]);
        }, 1600);
      }
    };
    input.click();
  };

  const openPromptLibrary = () => {
    alert(
      'Prompt Library\n\n• Summarise client objectives\n• Suggest executive summary\n• Generate RFP questionnaire answers\n• Compare with previous RFPs'
    );
  };

  const triggerResearch = () => {
    const query = inputValue.trim() || 'latest RFP best practices for cash management';
    const userMsg = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: `🔍 Research: ${query}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        text: `Research complete for: "${query}"\n\nFound 5 relevant sources. Top insight: Multi-currency pooling structures have seen a 34% increase in APAC RFP requests in 2025. Would you like me to incorporate these findings?`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 2000);
  };

  const toggleMic = () => {
    setIsMicActive((prev) => !prev);
    if (!isMicActive) {
      setTimeout(() => {
        setIsMicActive(false);
        setInputValue('What are the key client objectives for this RFP?');
      }, 2000);
    }
  };

  const isSendActive = inputValue.trim().length > 0;

  return (
    <div className={`chat-shell ${isExpanded ? 'expanded' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <button className="icon-btn" title="History" onClick={toggleHistory}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9 5.5V9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
        <span className="chat-header-center">AI Chat</span>
        <div className="chat-header-icons">
          <button className="icon-btn" title="Expand" onClick={toggleExpand}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="icon-btn" title="Close" onClick={closeChat}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="header-underline"></div>

      {/* Context Pill */}
      <div className="context-bar">
        <div className="context-pill" onClick={cycleContext}>
          <span className="dot"></span>
          <span className="label">Asking about</span>
          <span className="value">{CONTEXTS[contextIndex]}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="#0250a3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <MessageRow message={message} />
            {message.type === 'bot' && (
              <>
                <MessageActions
                  messageId={message.id}
                  isLiked={likedMessages.has(message.id)}
                  isDisliked={dislikedMessages.has(message.id)}
                  onLike={toggleLike}
                  onDislike={toggleDislike}
                  onRegenerate={regenerate}
                  onCopy={copyMessage}
                  onExport={exportMessage}
                />
                <ConfidencePill onToggle={toggleConfidence} />
              </>
            )}
          </React.Fragment>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            className="input-field"
            placeholder="Ask anything"
            rows="1"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="input-toolbar">
            <button className="toolbar-btn" title="Attach" onClick={attachFile}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 7.5l-6 6a4 4 0 01-5.66-5.66l6-6a2.5 2.5 0 013.54 3.54L5.84 11.4a1 1 0 01-1.42-1.41L10 4.4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="toolbar-btn" title="Prompt library" onClick={openPromptLibrary}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="research-btn" onClick={triggerResearch}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="#0473ea" strokeWidth="1.2" />
                <path d="M8.5 8.5L11 11" stroke="#0473ea" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Research →
            </button>
            <div className="spacer"></div>
            <button
              className="mic-btn"
              title={isMicActive ? 'Stop recording' : 'Voice input'}
              onClick={toggleMic}
              style={{ color: isMicActive ? '#0473ea' : 'inherit' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2.5 8a5.5 5.5 0 0011 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="8" y1="13.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="5.5" y1="15.5" x2="10.5" y2="15.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className={`send-btn ${isSendActive ? 'active' : ''}`}
              title="Send"
              onClick={sendMessage}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M13 7.5L1.5 2l2 5.5-2 5.5L13 7.5z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageRow = ({ message }) => {
  if (message.type === 'user') {
    return (
      <div className="msg-row user">
        <div className="bubble user">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="msg-row">
      <div className="bot-avatar">🤖</div>
      <div>
        <div className="msg-sender">AI Design System</div>
        <div className="bubble">{message.text}</div>
      </div>
    </div>
  );
};

const MessageActions = ({
  messageId,
  isLiked,
  isDisliked,
  onLike,
  onDislike,
  onRegenerate,
  onCopy,
  onExport,
}) => {
  return (
    <div className="msg-actions">
      <button
        className={`action-btn ${isLiked ? 'active' : ''}`}
        title="Helpful"
        onClick={() => onLike(messageId)}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M2 7.5h2v5H2v-5zM4 7.5l3-5.5 1 .5v3h4l-.5 6H4V7.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className={`action-btn ${isDisliked ? 'active' : ''}`}
        title="Not helpful"
        onClick={() => onDislike(messageId)}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M13 7.5h-2V2.5H13v5zM11 7.5L8 13l-1-.5V9.5H3l.5-6H11v4z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button className="action-btn" title="Regenerate" onClick={onRegenerate}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2.5 7.5A5 5 0 1112.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M2.5 5v2.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="action-btn" title="Copy" onClick={onCopy}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button className="action-btn" title="Export" onClick={onExport}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v8M4.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 10v3h11v-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

const ConfidencePill = ({ onToggle }) => {
  return (
    <div className="confidence-pill" onClick={onToggle}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M5.5 1l1 2.8h2.9l-2.3 1.7.8 2.7-2.4-1.7-2.4 1.7.8-2.7L1.6 3.8h2.9z" fill="#269300" />
      </svg>
      Confidence: High
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path d="M1 1l3 3 3-3" stroke="#269300" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="msg-row">
      <div className="bot-avatar">🤖</div>
      <div className="bubble" style={{ padding: '8px 14px' }}>
        <div className="typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
