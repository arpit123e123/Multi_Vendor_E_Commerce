import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import aiService from "../../services/aiService";

const CHAT_STORAGE_KEY = "shophub_ai_chat_history";

function AIChat() {
  const navigate = useNavigate();

  const [GIMINI, setGIMINI] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load saved chat history when component mounts
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);

      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);

        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error("Failed to load AI chat history:", error);
    }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error("Failed to save AI chat history:", error);
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const renderMessage = (content) => {
    const parts = content.split(
      /(\/products\/[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)/g,
    );

    return parts.map((part, index) => {
      if (part.startsWith("/products/")) {
        return (
          <button
            key={index}
            type="button"
            onClick={() => navigate(part)}
            className="text-blue-600 underline font-semibold hover:text-blue-800"
          >
            View Product
          </button>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const data = await aiService.chat(text);

      const assistantMessage = {
        role: "assistant",
        content:
          data.reply || "I couldn't find a suitable answer.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, something went wrong. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setGIMINI((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl hover:bg-gray-800 transition"
      >
        AI
      </button>

      {/* Chat Window */}

      {GIMINI && (
        <div className="fixed bottom-24 right-6 z-50 w-90 max-w-[calc(100vw-32px)] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}

          <div className="px-5 py-4 bg-gray-900 text-white flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                ShopHub Assistant
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Find the right products faster
              </p>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="text-xs text-gray-300 hover:text-white transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}

          <div className="h-90 overflow-y-auto p-4 space-y-3">

            {messages.length === 0 && (
              <div className="text-center pt-20 px-5">
                <p className="font-semibold text-gray-900">
                  How can I help?
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Try asking:
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  "Show me products under ₹2000"
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.role === "assistant"
                    ? renderMessage(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">
                Finding the best options...
              </div>
            )}
          </div>

          {/* Input */}

          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 p-3 flex gap-2"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIChat;