import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

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
      className={`flex justify-between items-center px-5 py-3 ${
        darkMode ? "bg-dark-darker" : "bg-light-darker"
      } transition-colors duration-300`}
    >
      <div className="flex items-center">
        {currentUser && (
          <span
            className={`font-medium text-lg ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {currentUser.role === "admin" ? "Admin" : "Student"}{" "}
            {currentUser.username}
          </span>
        )}
      </div>

      <div className="flex items-center">
        <button
          onClick={toggleDarkMode}
          className={`mr-4 p-2 rounded-full ${
            darkMode
              ? "bg-gray-700 text-yellow-400"
              : "bg-blue-100 text-blue-800"
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button
          onClick={handleLogout}
          className="bg-primary-red hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
