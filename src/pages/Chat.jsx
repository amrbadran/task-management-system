import { useState, useEffect, useContext, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import MainLayout from "../components/Layout/MainLayout";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { GET_STUDENTS, GET_CHAT_MESSAGES } from "../utils/graphql/queries";
import { SEND_MESSAGE } from "../utils/graphql/mutations";
import { MESSAGE_RECEIVED } from "../utils/graphql/subscriptions";

const ChatWindow = ({ receiver, messages, onSendMessage, loading }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div
        className={`flex-1 flex flex-col rounded-lg ${
          darkMode ? "bg-dark-card" : "bg-light-card"
        }`}
      >
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Loading messages...
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col rounded-lg ${
        darkMode ? "bg-dark-card" : "bg-light-card"
      }`}
    >
      <div
        className={`p-4 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h2
          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {receiver
            ? `Chatting with ${receiver.username}`
            : "Select a user to start chatting"}
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
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
          ))
        ) : (
          <p className="text-center text-gray-400">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <form className="flex" onSubmit={handleSendMessage}>
          <input
            type="text"
            className={`flex-1 p-2.5 rounded-l ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
            }`}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!receiver}
          />
          <button
            type="submit"
            className="bg-primary-green text-white px-4 py-2.5 rounded-r hover:bg-green-600 transition-colors duration-300"
            disabled={!receiver}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // Query users
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
    fetchPolicy: "network-only",
  });

  // Query chat messages when a user is selected
  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery(GET_CHAT_MESSAGES, {
    variables: { userId: selectedUser?.id },
    skip: !selectedUser,
    fetchPolicy: "network-only",
  });

  // Subscribe to new messages
  const { data: subscriptionData } = useSubscription(MESSAGE_RECEIVED, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
    onData: ({ data }) => {
      if (data?.data?.messageReceived) {
        // If we're chatting with this user, refetch messages
        if (
          selectedUser &&
          (data.data.messageReceived.sender.id === selectedUser.id ||
            data.data.messageReceived.receiver.id === selectedUser.id)
        ) {
          refetchMessages();
        }
      }
    },
  });

  // Send message mutation
  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetchMessages();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    },
  });

  // Update users list when data changes
  useEffect(() => {
    if (usersData && usersData.students) {
      const filteredUsers = usersData.students.filter((user) => {
        // Don't show current user in the list
        if (user.id === currentUser.id) return false;

        // For students, only show admins
        if (currentUser.role === "student") {
          return user.role === "admin";
        }

        // For admins, only show students
        if (currentUser.role === "admin") {
          return user.role === "student";
        }

        return false;
      });

      setUsers(filteredUsers);
    }
  }, [usersData, currentUser]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async (message) => {
    if (!selectedUser || !message.trim()) return;

    try {
      await sendMessageMutation({
        variables: {
          receiverId: selectedUser.id,
          message: message.trim(),
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Get displayed messages
  const messages = messagesData?.chatMessages || [];

  if (usersLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-lg">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className={`container mx-auto px-4 ${
          darkMode ? "bg-dark-bg" : "bg-light-bg"
        } transition-colors duration-300`}
      >
        <div className="flex flex-col md:flex-row gap-5 h-[calc(100vh-200px)]">
          {/* User List */}
          <div
            className={`w-full md:w-1/4 ${
              darkMode ? "bg-dark-card" : "bg-light-card"
            } rounded-lg overflow-hidden`}
          >
            <h3
              className={`p-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {currentUser.role === "student" ? "Admins" : "Students"}
            </h3>
            <div className="overflow-y-auto h-full max-h-[calc(100vh-250px)]">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    } cursor-pointer transition-colors duration-200 ${
                      selectedUser?.id === user.id
                        ? darkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className={darkMode ? "text-white" : "text-gray-800"}>
                      {user.username}
                      {user.universityId && (
                        <div className="text-sm text-gray-400">
                          ID: {user.universityId}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`p-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No {currentUser.role === "admin" ? "students" : "admins"}{" "}
                  available.
                  {usersError && (
                    <div className="mt-2 text-sm text-red-400">
                      Could not connect to server.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <ChatWindow
            receiver={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={messagesLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
