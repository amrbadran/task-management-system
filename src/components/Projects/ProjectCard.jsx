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
        } rounded-lg p-5 transition-all duration-300
        cursor-pointer ${isHovered ? "transform scale-105" : ""
        } ${getBorderColor()} ${darkMode ? "shadow-md" : "shadow-lg border border-gray-100"}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-medium mb-2.5 text-primary-blue">
        {project.title}
      </h3>

      <div className="mb-4">
        <p
          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Description:
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          {project.description.length > 100
            ? `${project.description.substring(0, 100)}...`
            : project.description}
        </p>
      </div>

      <div className="mb-4">
        <p
          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Students:
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          {project.students
            .map((student) => student.username || student)
            .join(", ")}
        </p>
      </div>

      <div className="mb-4">
        <p
          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Category:
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          {project.category}
        </p>
      </div>

      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-sm mb-1 overflow-hidden">
        <div
          className="h-full bg-primary-blue"
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs mt-1 mb-2">
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {project.progress}% complete
        </span>
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Auto-calculated
        </span>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{formatDate(project.startDate)}</span>
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{formatDate(project.endDate)}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
