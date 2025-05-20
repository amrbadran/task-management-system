import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState({});
  const { currentUser } = useContext(AuthContext);

  // Load chat data from localStorage on mount
  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  // Save chat data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Send a message
  const sendMessage = (studentId, message) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.role,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setChats((prevChats) => {
      const studentChats = prevChats[studentId] || [];
      return {
        ...prevChats,
        [studentId]: [...studentChats, newMessage],
      };
    });

    return newMessage;
  };

  // Get messages for a specific student
  const getMessagesForStudent = (studentId) => {
    return chats[studentId] || [];
  };

  // Mark message as read
  const markMessageAsRead = (studentId, messageId) => {
    setChats((prevChats) => {
      const studentChats = prevChats[studentId] || [];
      const updatedChats = studentChats.map((chat) =>
        chat.id === messageId ? { ...chat, read: true } : chat
      );

      return {
        ...prevChats,
        [studentId]: updatedChats,
      };
    });
  };

  const value = {
    chats,
    sendMessage,
    getMessagesForStudent,
    markMessageAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
