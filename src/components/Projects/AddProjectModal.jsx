import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaTimes } from "react-icons/fa";

const AddProjectModal = ({ isOpen, onClose, onAddProject, students }) => {
  const { darkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      await onAddProject({
        title,
        description,
        students: selectedStudents,
        category,
        startDate,
        endDate,
        status,
      });

      resetForm();
      onClose();
    } catch (error) {
      setError(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedStudents([]);
    setCategory("");
    setStartDate("");
    setEndDate("");
    setStatus("In Progress");
    setError("");
  };

  const handleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full max-w-[550px] ${darkMode ? "bg-dark-darker" : "bg-white"
          } rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-blue">
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 ${darkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 rounded-lg animate-scale-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                  : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                } border focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
              placeholder="Enter project title"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Project Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                  : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                } border min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
              placeholder="Describe the project"
              required
              disabled={loading}
            ></textarea>
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Students List
            </label>
            <div
              className={`max-h-[150px] overflow-y-auto p-3 rounded-lg border ${darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
                }`}
            >
              {students && students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center p-2.5 mb-2 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedStudents.includes(student.id)
                        ? "bg-primary-blue text-white shadow-md"
                        : darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                    onClick={() => handleStudentSelection(student.id)}
                  >
                    <span className="font-medium">
                      {student.username}
                      {student.universityId && (
                        <span className="text-sm ml-2 opacity-75">
                          (ID: {student.universityId})
                        </span>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className={`p-2 text-center ${darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  No students available
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                    : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                  } border focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
                required
                disabled={loading}
              >
                <option value="">Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="DevOps">DevOps</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                    : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                  } border focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
                required
                disabled={loading}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                    : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                  } border focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full p-3 rounded-lg transition-all duration-200 ${darkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:border-primary-blue"
                    : "bg-gray-50 text-gray-800 border-gray-200 focus:border-primary-blue"
                  } border focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-20`}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-primary-green hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
