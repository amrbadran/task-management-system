import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [universityId, setUniversityId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isStudent && !universityId.trim()) {
      setError("University ID is required for students");
      setLoading(false);
      return;
    }

    try {
      await signup({
        username,
        password,
        isStudent,
        universityId: isStudent ? universityId : null,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen p-5 ${
        darkMode ? "bg-dark-bg" : "bg-light-bg"
      } transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-[450px] ${
          darkMode ? "bg-dark-darker" : "bg-light-darker"
        } rounded-lg p-8 shadow-md transition-colors duration-300`}
      >
        <h1
          className={`text-center mb-8 text-3xl font-medium ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Sign Up
        </h1>

        {error && (
          <div className="mb-5 p-3 bg-red-600 text-white rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block mb-2 text-base text-white"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              className={`w-full px-4 py-3 rounded ${
                darkMode
                  ? "bg-dark-card border-none text-white"
                  : "bg-white border border-gray-300 text-gray-800"
              } 
                text-base focus:outline-none focus:ring-2 focus:ring-primary-blue transition-colors duration-300`}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-base text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className={`w-full px-4 py-3 rounded ${
                darkMode
                  ? "bg-dark-card border-none text-white"
                  : "bg-white border border-gray-300 text-gray-800"
              } 
                text-base focus:outline-none focus:ring-2 focus:ring-primary-blue transition-colors duration-300`}
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center mt-4">
              <input
                id="is-student"
                type="checkbox"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                disabled={loading}
                className="mr-2.5 w-[18px] h-[18px] cursor-pointer"
              />
              <label
                htmlFor="is-student"
                className="m-0 cursor-pointer text-white"
              >
                I am a student
              </label>
            </div>
          </div>

          {isStudent && (
            <div className="mb-5">
              <label
                htmlFor="universityId"
                className="block mb-2 text-base text-white"
              >
                University ID
              </label>
              <input
                id="universityId"
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                disabled={loading}
                required
                className={`w-full px-4 py-3 rounded ${
                  darkMode
                    ? "bg-dark-card border-none text-white"
                    : "bg-white border border-gray-300 text-gray-800"
                } 
                text-base focus:outline-none focus:ring-2 focus:ring-primary-blue transition-colors duration-300`}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-green hover:bg-green-600 text-white font-medium text-base rounded cursor-pointer transition duration-200"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-500 no-underline hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
