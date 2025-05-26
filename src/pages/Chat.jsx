import { useState, useEffect, useContext, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import MainLayout from "../components/Layout/MainLayout";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { GET_STUDENTS, GET_CHAT_MESSAGES } from "../utils/graphql/queries";
import { SEND_MESSAGE } from "../utils/graphql/mutations";
import { MESSAGE_RECEIVED } from "../utils/graphql/subscriptions";
import { FaComments, FaPaperPlane, FaUser, FaCircle } from "react-icons/fa";

const ChatWindow = ({ receiver, messages, onSendMessage, loading }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
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
        className={`flex-1 flex flex-col rounded-2xl shadow-soft ${
          darkMode ? "bg-dark-card" : "bg-white"
        } border ${darkMode ? "border-darkBorder/30" : "border-gray-200"}`}
      >
        <div
          className={`p-6 border-b ${
            darkMode ? "border-darkBorder/30" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${
                darkMode ? "bg-dark-elevated" : "bg-gray-100"
              } animate-pulse`}
            />
            <div className="flex-1">
              <div
                className={`h-5 w-32 rounded ${
                  darkMode ? "bg-dark-elevated" : "bg-gray-100"
                } animate-pulse`}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-10 w-10 text-primary-blue"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className={darkMode ? "text-text-muted" : "text-gray-500"}>
              Loading conversation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col rounded-2xl shadow-soft ${
        darkMode ? "bg-dark-card" : "bg-white"
      } border ${
        darkMode ? "border-darkBorder/30" : "border-gray-200"
      } overflow-hidden`}
    >
      <div
        className={`px-6 py-4 border-b ${
          darkMode ? "border-darkBorder/30" : "border-gray-200"
        } ${darkMode ? "bg-dark-elevated/50" : "bg-gray-50"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {receiver ? (
              <>
                <div
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-primary-blue/20" : "bg-primary-blue/10"
                  }`}
                >
                  <FaUser className="w-5 h-5 text-primary-blue" />
                  <FaCircle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 bg-dark-card rounded-full" />
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {receiver.username}
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-text-muted" : "text-gray-500"
                    }`}
                  >
                    {receiver.role === "admin" ? "Administrator" : "Student"}
                    {receiver.universityId && ` • ${receiver.universityId}`}
                  </p>
                </div>
              </>
            ) : (
              <p
                className={`font-medium ${
                  darkMode ? "text-text-muted" : "text-gray-500"
                }`}
              >
                Select a user to start chatting
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender.id === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isCurrentUser ? "order-2" : "order-1"
                    }`}
                  >
                    {!isCurrentUser && (
                      <p
                        className={`text-xs font-medium mb-1 ${
                          darkMode ? "text-text-muted" : "text-gray-500"
                        }`}
                      >
                        {msg.sender.username}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-br-md"
                          : darkMode
                          ? "bg-dark-elevated text-white rounded-bl-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      } ${darkMode ? "text-text-muted" : "text-gray-400"}`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FaComments
              className={`w-16 h-16 mb-4 ${
                darkMode ? "text-text-muted" : "text-gray-300"
              }`}
            />
            <p
              className={`text-center ${
                darkMode ? "text-text-muted" : "text-gray-500"
              }`}
            >
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className={`p-4 border-t ${
          darkMode
            ? "border-darkBorder/30 bg-dark-elevated/50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <form className="flex gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            className={`flex-1 px-4 py-3 rounded-xl ${
              darkMode
                ? "bg-dark-card text-white placeholder:text-text-muted"
                : "bg-white text-gray-900 placeholder:text-gray-400"
            } border ${
              darkMode ? "border-darkBorder/50" : "border-gray-200"
            } focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-200`}
            placeholder={
              receiver
                ? "Type your message..."
                : "Select a user to start chatting"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!receiver}
          />
          <button
            type="submit"
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!receiver || !message.trim()}
          >
            <FaPaperPlane className="w-4 h-4" />
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

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
    fetchPolicy: "network-only",
  });

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

  const { data: subscriptionData } = useSubscription(MESSAGE_RECEIVED, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
    onData: ({ data }) => {
      if (data?.data?.messageReceived) {
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

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetchMessages();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    },
  });

  useEffect(() => {
    if (usersData && usersData.students) {
      const filteredUsers = usersData.students.filter((user) => {
        if (user.id === currentUser.id) return false;

        if (currentUser.role === "student") {
          return user.role === "admin";
        }

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

  const messages = messagesData?.chatMessages || [];

  if (usersLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-10 w-10 text-primary-blue"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className={darkMode ? "text-text-muted" : "text-gray-500"}>
              Loading chat...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Chat</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-text-muted" : "text-gray-500"
            }`}
          >
            Connect with{" "}
            {currentUser.role === "student" ? "administrators" : "students"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)]">
          <div
            className={`w-full md:w-80 rounded-2xl shadow-soft ${
              darkMode ? "bg-dark-card" : "bg-white"
            } border ${
              darkMode ? "border-darkBorder/30" : "border-gray-200"
            } overflow-hidden flex flex-col`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode
                  ? "border-darkBorder/30 bg-dark-elevated/50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <h3
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {currentUser.role === "student" ? "Administrators" : "Students"}
              </h3>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-text-muted" : "text-gray-500"
                }`}
              >
                {users.length} {users.length === 1 ? "user" : "users"} available
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.length > 0 ? (
                <div className="p-3 space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                        selectedUser?.id === user.id
                          ? darkMode
                            ? "bg-primary-blue/20 border-primary-blue"
                            : "bg-primary-blue/10 border-primary-blue"
                          : darkMode
                          ? "hover:bg-dark-elevated"
                          : "hover:bg-gray-50"
                      } border ${
                        selectedUser?.id === user.id
                          ? "border-primary-blue"
                          : "border-transparent"
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                            darkMode ? "bg-dark-elevated" : "bg-gray-100"
                          } ${
                            selectedUser?.id === user.id
                              ? "bg-primary-blue/20"
                              : ""
                          }`}
                        >
                          <FaUser
                            className={`w-5 h-5 ${
                              selectedUser?.id === user.id
                                ? "text-primary-blue"
                                : darkMode
                                ? "text-text-muted"
                                : "text-gray-500"
                            }`}
                          />
                          <FaCircle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 bg-dark-card rounded-full" />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user.username}
                          </p>
                          {user.universityId && (
                            <p
                              className={`text-xs ${
                                darkMode ? "text-text-muted" : "text-gray-500"
                              }`}
                            >
                              ID: {user.universityId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <FaUser
                    className={`w-12 h-12 mb-3 ${
                      darkMode ? "text-text-muted" : "text-gray-300"
                    }`}
                  />
                  <p
                    className={`text-center ${
                      darkMode ? "text-text-muted" : "text-gray-500"
                    }`}
                  >
                    No {currentUser.role === "admin" ? "students" : "admins"}{" "}
                    available
                  </p>
                  {usersError && (
                    <p className="mt-2 text-sm text-red-400">
                      Could not connect to server
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

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
