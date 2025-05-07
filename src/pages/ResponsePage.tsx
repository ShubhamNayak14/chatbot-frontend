import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserRoundPen,
  BotMessageSquare,
  ArrowLeft,
  Loader2,
  SendHorizonal,
  Bot,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

type ChatMessage = {
  sender: "user" | "bot";
  content: string;
  timestamp: string;
};

const ResponsePage: React.FC = () => {
  const apiKey = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  // Scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  // Automatically send the query parameter as the first message
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userQuestion = queryParams.get("q");
    if (userQuestion) {
      setInput(userQuestion);
      sendMessage(userQuestion);
    }
  }, [location.search]);

  const sendMessage = async (message?: string) => {
    const userMessage = message || input;
    if (!userMessage.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMessage: ChatMessage = {
      sender: "user",
      content: userMessage,
      timestamp,
    };
    setChat((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");
      const data = await res.json();

      const botMessage: ChatMessage = {
        sender: "bot",
        content: data.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(); // No argument needed, it'll use the input state
    }
  };

  const exportChatToPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const lineHeight = 8;
    const maxLineWidth = pageWidth - margin * 2;
    let pageNumber = 1;

    const addHeader = () => {
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Chat History", margin, margin + lineHeight);
    };

    const addFooter = () => {
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
    };

    const addNewPage = () => {
      doc.addPage();
      pageNumber++;
      addHeader();
      addFooter();
      return margin + 12; // new y start after header and footer
    };

    addHeader();
    addFooter();

    doc.setFontSize(12);

    let cursorY = margin + 18;

    chat.forEach((msg: ChatMessage) => {
      const sender = msg.sender === "user" ? "You" : "Bot";
      const time = msg.timestamp;
      const header = `${sender} [${time}]`;

      const contentLines = doc.splitTextToSize(msg.content || "", maxLineWidth);
      const boxHeight = contentLines.length * lineHeight + 4;

      // Check if we need to add a new page
      if (cursorY + lineHeight * 2 + boxHeight > pageHeight - margin) {
        cursorY = addNewPage(); // Start at new page after header/footer
      }

      // Header
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      doc.text(header, margin, cursorY);
      cursorY += lineHeight;

      // Background box (use tuple for RGB values)
      const bgColor: [number, number, number] =
        msg.sender === "user" ? [255, 230, 230] : [230, 240, 255];
      doc.setFillColor(...bgColor); // Correctly using spread operator

      doc.rect(margin - 1, cursorY - 3, maxLineWidth + 2, boxHeight, "F");

      // Message text
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      contentLines.forEach((line: string) => {
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      cursorY += 4; // spacing between messages
    });

    doc.save("chat-history.pdf");
  };

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center">
        <Bot className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-pulse" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white group transition-colors"
        >
          <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex gap-2">
          {chat.length > 0 && (
            <button
              onClick={clearChat}
              className="text-sm text-red-400 hover:text-white border border-red-500 hover:border-white px-3 py-1 rounded-full transition-colors"
            >
              Clear Chat
            </button>
          )}
          <button
            onClick={exportChatToPDF} // Export chat as PDF
            className="text-sm text-pink-400 hover:text-white border border-pink-500 hover:border-white px-3 py-1 rounded-full transition-colors"
          >
            Export Chat as PDF
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 mb-4 overflow-y-auto max-h-[400px] pr-2 overflow-x-hidden">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 flex items-center justify-center font-bold">
                  <BotMessageSquare className="text-pink-400" />
                </div>
              )}
              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`rounded-xl px-4 py-3 break-words whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-pink-600/20 text-pink-300 self-end"
                      : "bg-white/5 text-gray-300 self-start"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 flex items-center justify-center font-bold">
                  <UserRoundPen className="text-purple-500" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-purple-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating response...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-white/20 pt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent border border-gray-600 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()} // Calls sendMessage without argument
            className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <SendHorizonal className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponsePage;
