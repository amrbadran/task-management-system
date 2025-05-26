import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const StatCard = ({ title, value, icon: Icon, gradient }) => {
  const { darkMode } = useContext(ThemeContext);

  const defaultGradient = "from-primary-blue to-primary-purple";
  const cardGradient = gradient || defaultGradient;

  return (
    <div
      className={`group relative ${
        darkMode ? "bg-dark-card" : "bg-white"
      } rounded-2xl p-6 shadow-soft border ${
        darkMode ? "border-darkBorder/30" : "border-gray-200"
      } transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
    >
      {}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {}
      {Icon && (
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cardGradient} mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}

      <h3
        className={`text-sm font-medium mb-2 ${
          darkMode ? "text-text-muted" : "text-gray-500"
        }`}
      >
        {title}
      </h3>

      <p
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>

      {}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cardGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </div>
  );
};

export default StatCard;
