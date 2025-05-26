import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";

const ChatWindow = ({ student, chats, onSendMessage, loading }) => {
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? "bg-dark-card text-white" : "bg-light-card text-gray-800"
      } rounded-lg transition-colors duration-300`}
    >
      <div
        className={`p-4 ${
          darkMode ? "border-b border-gray-700" : "border-b border-gray-200"
        }`}
      >
        <h2
          className={`text-lg font-medium ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {student
            ? `Chatting with ${student.username}`
            : "Select a user to start chatting"}
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            return (
              <div key={msg.id} className="mb-4">
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {msg.sender.username}
                </div>
                <div className={darkMode ? "text-white" : "text-gray-800"}>
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={`p-4 ${
          darkMode ? "border-t border-gray-700" : "border-t border-gray-200"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!student}
            className={`flex-1 p-2.5 rounded-l ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
            } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue transition-colors duration-300 ${
              !student ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <button
            type="submit"
            disabled={!student}
            className={`bg-primary-green hover:bg-green-600 text-white px-4 py-2.5 rounded-r transition-colors duration-300 ${
              !student ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
