import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaBars, FaTimes, FaHome, FaProjectDiagram, FaTasks, FaComments } from "react-icons/fa";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    ...(currentUser.role === "admin" ? [{ path: "/", label: "Home", icon: <FaHome className="w-5 h-5" /> }] : []),
    { path: "/projects", label: "Projects", icon: <FaProjectDiagram className="w-5 h-5" /> },
    { path: "/tasks", label: "Tasks", icon: <FaTasks className="w-5 h-5" /> },
    { path: "/chat", label: "Chat", icon: <FaComments className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 ${darkMode
            ? "bg-gray-800 bg-opacity-80 text-white hover:bg-gray-700"
            : "bg-white bg-opacity-80 text-gray-800 hover:bg-gray-100"
          }`}
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`max-md:fixed top-0 left-0 h-screen w-[240px] z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ${darkMode ? "bg-dark-darker" : "bg-white"
          } shadow-xl flex-shrink-0 overflow-y-auto`}
      >
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Task Manager
          </h2>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${darkMode
                    ? "hover:bg-gray-800 hover:bg-opacity-50"
                    : "hover:bg-gray-100"
                  } ${isActive
                    ? `bg-primary-blue text-white shadow-lg shadow-blue-500/25 ${darkMode ? "" : "hover:bg-primary-blue"
                    }`
                    : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
