import { useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ThemeContext } from "../../contexts/ThemeContext";

const MainLayout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen ${
        darkMode ? "bg-dark-bg" : "bg-light-bg"
      } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
