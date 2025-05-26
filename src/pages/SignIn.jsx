import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signin } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin(username, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        darkMode ? "bg-dark-bg" : "bg-gray-50"
      }`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-primary-blue/20 via-primary-purple/20 to-primary-pink/20"
              : "bg-gradient-to-br from-primary-blue/10 via-primary-purple/10 to-primary-pink/10"
          } animate-gradient`}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-blue/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-primary-purple/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Sign In Card */}
      <div
        className={`relative w-full max-w-md ${
          darkMode ? "bg-dark-card/80" : "bg-white/80"
        } backdrop-blur-xl rounded-3xl shadow-2xl p-8 border ${
          darkMode ? "border-darkBorder/50" : "border-gray-200"
        } animate-fade-in-up`}
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
              darkMode ? "bg-primary-blue/20" : "bg-primary-blue/10"
            }`}
          >
            <FaSignInAlt className="w-8 h-8 text-primary-blue" />
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-text-muted" : "text-gray-500"
            }`}
          >
            Sign in to continue to TaskFlow
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl animate-scale-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-text-light" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser
                  className={`w-5 h-5 ${
                    darkMode ? "text-text-muted" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                  darkMode
                    ? "bg-dark-elevated text-white placeholder:text-text-muted"
                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                } border ${
                  darkMode ? "border-darkBorder/50" : "border-gray-200"
                } focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-200`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-text-light" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock
                  className={`w-5 h-5 ${
                    darkMode ? "text-text-muted" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                  darkMode
                    ? "bg-dark-elevated text-white placeholder:text-text-muted"
                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                } border ${
                  darkMode ? "border-darkBorder/50" : "border-gray-200"
                } focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-200`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                disabled={loading}
                className="sr-only"
              />
              <div
                className={`relative w-5 h-5 rounded ${
                  staySignedIn
                    ? "bg-primary-blue"
                    : darkMode
                    ? "bg-dark-elevated border-2 border-darkBorder"
                    : "bg-gray-100 border-2 border-gray-300"
                } transition-all duration-200 group-hover:border-primary-blue`}
              >
                {staySignedIn && (
                  <svg
                    className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`ml-2 text-sm ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                Stay signed in
              </span>
            </label>

            <Link
              to="/forgot-password"
              className={`text-sm font-medium ${
                darkMode
                  ? "text-primary-blue hover:text-primary-light"
                  : "text-primary-dark hover:text-primary-blue"
              } transition-colors duration-200`}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-blue to-primary-purple 
              hover:from-primary-dark hover:to-primary-purple shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${loading ? "animate-pulse" : ""}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-text-muted" : "text-gray-500"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={`font-semibold ${
                darkMode
                  ? "text-primary-blue hover:text-primary-light"
                  : "text-primary-dark hover:text-primary-blue"
              } transition-colors duration-200`}
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
