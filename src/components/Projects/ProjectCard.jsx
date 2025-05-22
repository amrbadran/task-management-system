import { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const ProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const getBorderColor = () => {
    switch (project.category) {
      case "Web Development":
        return "border-gray-500";
      case "Mobile Development":
        return "border-yellow-500";
      case "Data Science":
        return "border-blue-500";
      case "Machine Learning":
        return "border-gray-500";
      default:
        return "border-gray-400";
    }
  };

  // Helper function to safely format dates
  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      const date = new Date(Number(input)); // Works for both timestamp & ISO string
      if (isNaN(date.getTime())) return "N/A"; // Invalid date check
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const handleCardClick = (e) => {
    // Only trigger the onClick handler if the click was directly on the card
    // and not on a child button
    if (e.currentTarget === e.target || !e.target.closest('button')) {
      onClick(project);
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-dark-card" : "bg-white"
        } rounded-xl p-6 transition-all duration-300
        cursor-pointer border-2 ${getBorderColor()} border-opacity-20
        ${isHovered ? "transform -translate-y-1 shadow-2xl border-opacity-40" : "shadow-soft hover:shadow-xl"
        } ${darkMode ? "" : "hover:shadow-xl"}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-semibold mb-3 text-primary-blue">
        {project.title}
      </h3>

      <div className="mb-4">
        <p
          className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
        >
          Description:
        </p>
        <p
          className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          {project.description.length > 100
            ? `${project.description.substring(0, 100)}...`
            : project.description}
        </p>
      </div>

      <div className="mb-4">
        <p
          className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
        >
          Students:
        </p>
        <div className="flex flex-wrap gap-1">
          {project.students
            .map((student) => student.username || student)
            .map((name, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}
              >
                {name}
              </span>
            ))}
        </div>
      </div>

      <div className="mb-4">
        <p
          className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
        >
          Category:
        </p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-primary-blue bg-opacity-20 text-primary-blue" : "bg-primary-blue bg-opacity-10 text-primary-blue"
            }`}
        >
          {project.category}
        </span>
      </div>

      <div className="mb-3">
        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-primary-blue to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
            Progress
          </span>
          <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {project.progress}%
          </span>
        </div>
      </div>

      <div className="flex justify-between text-xs pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}">
        <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
          <span className="font-medium">Start:</span> {formatDate(project.startDate)}
        </span>
        <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
          <span className="font-medium">End:</span> {formatDate(project.endDate)}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
