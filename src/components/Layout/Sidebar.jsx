import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaComments,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    ...(currentUser.role === "admin"
      ? [
          {
            path: "/",
            label: "Dashboard",
            icon: FaHome,
            gradient: "from-blue-500 to-cyan-500",
          },
        ]
      : []),
    {
      path: "/projects",
      label: "Projects",
      icon: FaProjectDiagram,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: FaTasks,
      gradient: "from-green-500 to-teal-500",
    },
    {
      path: "/chat",
      label: "Chat",
      icon: FaComments,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl shadow-lg backdrop-blur-xl transition-all duration-300 ${
          darkMode
            ? "bg-dark-card/80 hover:bg-dark-card text-white border border-darkBorder/50"
            : "bg-white/80 hover:bg-white text-gray-800 border border-gray-200"
        } hover:scale-105 active:scale-95`}
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-[260px] z-40 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          darkMode ? "bg-dark-card/95" : "bg-white/95"
        } backdrop-blur-xl border-r ${
          darkMode ? "border-darkBorder/50" : "border-gray-200"
        } flex flex-col`}
      >
        {}
        <div className="p-6 pb-2">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-1`}
          >
            TaskFlow
          </h2>
          <p
            className={`text-xs ${
              darkMode ? "text-text-muted" : "text-gray-500"
            }`}
          >
            Project Management System
          </p>
        </div>

        {}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? darkMode
                          ? "bg-primary-blue/20 text-white"
                          : "bg-primary-blue/10 text-primary-blue"
                        : darkMode
                        ? "text-text-light hover:text-white hover:bg-dark-elevated"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {}
                    {isActive && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full transition-all duration-300`}
                      />
                    )}

                    {}
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                          : darkMode
                          ? "bg-dark-elevated group-hover:bg-dark-hover"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                      />
                    </div>

                    {}
                    <span
                      className={`font-medium flex-1 ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </span>

                    {}
                    <FaChevronRight
                      className={`w-3 h-3 transition-all duration-300 ${
                        isActive ||
                        "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      } ${darkMode ? "text-text-muted" : "text-gray-400"}`}
                    />

                    {}
                    {isActive && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-xl blur-xl`}
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {}
        <div
          className={`p-4 mt-auto border-t ${
            darkMode ? "border-darkBorder/50" : "border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              darkMode ? "bg-dark-elevated" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-xs font-medium ${
                darkMode ? "text-text-muted" : "text-gray-500"
              }`}
            >
              Logged in as
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {currentUser.username}
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-primary-blue" : "text-primary-dark"
              }`}
            >
              {currentUser.role === "admin" ? "Administrator" : "Student"}
            </p>
          </div>
        </div>
      </aside>

      {}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        />
      )}
    </>
  );
};

export default Sidebar;
