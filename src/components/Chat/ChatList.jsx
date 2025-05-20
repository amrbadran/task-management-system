import { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const ChatList = ({ students, onSelectStudent, selectedStudent }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`w-full h-full ${
        darkMode ? "bg-dark-card" : "bg-light-card"
      } rounded-lg overflow-hidden transition-colors duration-300`}
    >
      <h3
        className={`text-lg font-medium p-4 ${
          darkMode ? "border-b border-gray-700" : "border-b border-gray-200"
        } ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        List of Students
      </h3>

      <div className="overflow-y-auto h-full max-h-[calc(100vh-200px)]">
        {students && students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              className={`p-4 ${
                darkMode
                  ? "border-b border-gray-700"
                  : "border-b border-gray-200"
              } 
                hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer transition-colors duration-200
                ${
                  selectedStudent && selectedStudent.id === student.id
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : ""
                }`}
              onClick={() => onSelectStudent(student)}
            >
              <div className={darkMode ? "text-white" : "text-gray-800"}>
                {student.username}
                {student.universityId && (
                  <div className="text-sm text-gray-400">
                    ID: {student.universityId}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500">No students available</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
