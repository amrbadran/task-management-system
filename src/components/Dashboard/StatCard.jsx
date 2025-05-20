import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const StatCard = ({ title, value }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`${
        darkMode ? "bg-dark-card" : "bg-light-card"
      } p-4 rounded-lg shadow-md text-center transition-colors duration-300`}
    >
      <h3
        className={`text-base mb-2.5 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-2xl font-semibold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default StatCard;
