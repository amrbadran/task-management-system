import { useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ThemeContext } from "../../contexts/ThemeContext";

const MainLayout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen ${
        darkMode ? "bg-dark-bg" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className={`flex-1 p-6 overflow-y-auto ${
            darkMode ? "bg-dark-bg" : "bg-gray-50"
          }`}
        >
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
