import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Chat from "./pages/Chat";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { TaskProvider } from "./contexts/TaskContext";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 dark:bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/projects" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 dark:bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute adminOnly={true}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
