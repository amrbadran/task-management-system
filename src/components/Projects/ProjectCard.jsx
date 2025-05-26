import { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  FaCalendarAlt,
  FaUsers,
  FaTags,
  FaClock,
  FaEdit,
} from "react-icons/fa";

const ProjectCard = ({ project, onClick, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const getCategoryStyle = () => {
    switch (project.category) {
      case "Web Development":
        return "from-blue-500 to-cyan-500";
      case "Mobile Development":
        return "from-yellow-500 to-orange-500";
      case "Data Science":
        return "from-purple-500 to-pink-500";
      case "Machine Learning":
        return "from-green-500 to-teal-500";
      case "DevOps":
        return "from-red-500 to-rose-500";
      case "UX/UI Design":
        return "from-indigo-500 to-purple-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getStatusStyle = () => {
    switch (project.status) {
      case "Completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "On Hold":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      const date = new Date(Number(input));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const handleCardClick = (e) => {
    if (e.currentTarget === e.target || !e.target.closest("button")) {
      onClick(project);
    }
  };

  return (
    <div
      className={`group relative ${
        darkMode ? "bg-dark-card" : "bg-white"
      } rounded-2xl p-6 transition-all duration-300 cursor-pointer
        ${
          isHovered
            ? "transform -translate-y-2 shadow-2xl"
            : "shadow-soft hover:shadow-xl"
        } 
        border ${
          darkMode
            ? "border-darkBorder/30 hover:border-darkBorder/60"
            : "border-gray-200 hover:border-gray-300"
        }
        overflow-hidden`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getCategoryStyle()} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryStyle()}`}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gradient flex-1 mr-2">
            {project.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}
          >
            {project.status}
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
            darkMode ? "text-text-light" : "text-gray-600"
          }`}
        >
          {project.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <FaTags
            className={`w-3.5 h-3.5 ${
              darkMode ? "text-text-muted" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryStyle()} text-white`}
          >
            {project.category}
          </span>
        </div>

        <div className="flex items-start gap-2 mb-4">
          <FaUsers
            className={`w-3.5 h-3.5 mt-1 ${
              darkMode ? "text-text-muted" : "text-gray-400"
            }`}
          />
          <div className="flex flex-wrap gap-1.5 flex-1">
            {project.students
              .map((student) => student.username || student)
              .map((name, index) => (
                <span
                  key={index}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    darkMode
                      ? "bg-dark-elevated text-text-light"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {name}
                </span>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-xs font-medium ${
                darkMode ? "text-text-muted" : "text-gray-500"
              }`}
            >
              Progress
            </span>
            <span
              className={`text-xs font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {project.progress}%
            </span>
          </div>
          <div
            className={`h-2 rounded-full overflow-hidden ${
              darkMode ? "bg-dark-elevated" : "bg-gray-100"
            }`}
          >
            <div
              className={`h-full bg-gradient-to-r ${getCategoryStyle()} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
              style={{ width: `${project.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between text-xs pt-4 border-t ${
            darkMode ? "border-darkBorder/30" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt
              className={`w-3 h-3 ${
                darkMode ? "text-text-muted" : "text-gray-400"
              }`}
            />
            <span className={darkMode ? "text-text-muted" : "text-gray-500"}>
              {formatDate(project.startDate)}
            </span>
          </div>
          {onEdit ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${
                darkMode
                  ? "bg-dark-elevated hover:bg-dark-hover text-text-muted hover:text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
              title="Edit Project"
            >
              <FaEdit className="w-3 h-3" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <FaClock
                className={`w-3 h-3 ${
                  darkMode ? "text-text-muted" : "text-gray-400"
                }`}
              />
              <span className={darkMode ? "text-text-muted" : "text-gray-500"}>
                {formatDate(project.endDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default ProjectCard;
