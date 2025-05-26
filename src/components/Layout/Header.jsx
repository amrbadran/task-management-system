import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaSun, FaMoon, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { currentUser, signout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <header
      className={`sticky top-0 z-30 px-6 py-4 ${
        darkMode ? "bg-dark-card/80" : "bg-white/80"
      } backdrop-blur-xl border-b ${
        darkMode ? "border-darkBorder/50" : "border-gray-200"
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  darkMode ? "bg-dark-elevated" : "bg-gray-100"
                }`}
              >
                <FaUserCircle
                  className={`w-6 h-6 ${
                    darkMode ? "text-primary-blue" : "text-primary-dark"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-sm ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentUser.username}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  {currentUser.role === "admin" ? "Administrator" : "Student"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              darkMode
                ? "bg-dark-elevated hover:bg-dark-hover text-yellow-400 hover:text-yellow-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
            } group`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <div className="relative">
              {darkMode ? (
                <FaSun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <FaMoon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </div>
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              darkMode
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30"
                : "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
            } hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5`}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
