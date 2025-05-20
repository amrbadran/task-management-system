import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
          }`}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`max-md:fixed top-0 left-0 h-screen w-[220px] bg-opacity-90 z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ${darkMode ? "bg-dark-darker" : "bg-light-darker"
          } p-5 flex-shrink-0 overflow-y-auto`}
      >
        <div className="nav-items">
          {/* Conditionally render "Home" for admins only */}
          {currentUser.role === "admin" && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-3 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${darkMode
                  ? "hover:bg-opacity-40 hover:bg-gray-700"
                  : "hover:bg-gray-200"
                } ${isActive
                  ? "bg-primary-blue text-white"
                  : darkMode
                    ? "text-gray-300"
                    : "text-text-dark"
                }`
              }
            >
              Home
            </NavLink>
          )}
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `block px-4 py-3 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${darkMode
                ? "hover:bg-opacity-40 hover:bg-gray-700"
                : "hover:bg-gray-200"
              } ${isActive
                ? "bg-primary-blue text-white"
                : darkMode
                  ? "text-gray-300"
                  : "text-text-dark"
              }`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `block px-4 py-3 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${darkMode
                ? "hover:bg-opacity-40 hover:bg-gray-700"
                : "hover:bg-gray-200"
              } ${isActive
                ? "bg-primary-blue text-white"
                : darkMode
                  ? "text-gray-300"
                  : "text-text-dark"
              }`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `block px-4 py-3 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${darkMode
                ? "hover:bg-opacity-40 hover:bg-gray-700"
                : "hover:bg-gray-200"
              } ${isActive
                ? "bg-primary-blue text-white"
                : darkMode
                  ? "text-gray-300"
                  : "text-text-dark"
              }`
            }
          >
            Chat
          </NavLink>
        </div>
      </aside>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
