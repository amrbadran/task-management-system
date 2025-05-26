import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaTags,
  FaFlag,
  FaProjectDiagram,
} from "react-icons/fa";

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

  const categoryOptions = [
    { value: "Web Development", gradient: "from-blue-500 to-cyan-500" },
    { value: "Mobile Development", gradient: "from-yellow-500 to-orange-500" },
    { value: "Data Science", gradient: "from-purple-500 to-pink-500" },
    { value: "Machine Learning", gradient: "from-green-500 to-teal-500" },
    { value: "DevOps", gradient: "from-red-500 to-rose-500" },
    { value: "UX/UI Design", gradient: "from-indigo-500 to-purple-500" },
    { value: "Other", gradient: "from-gray-500 to-slate-500" },
  ];

  const statusOptions = [
    { value: "In Progress", color: "blue" },
    { value: "Completed", color: "green" },
    { value: "Pending", color: "yellow" },
    { value: "On Hold", color: "gray" },
    { value: "Cancelled", color: "red" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal-content max-w-2xl animate-slide-up">
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-primary-blue/20" : "bg-primary-blue/10"
              }`}
            >
              <FaProjectDiagram className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Create New Project
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? "text-text-muted" : "text-gray-500"
                }`}
              >
                Fill in the details to start a new project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              darkMode
                ? "hover:bg-dark-hover text-text-muted hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2 animate-scale-in">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive project title"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the project"
                rows={4}
                required
                disabled={loading}
                className="w-full resize-none"
              />
            </div>

            {}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaTags className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.value}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaFlag className="inline w-4 h-4 mr-1" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              >
                {statusOptions.map((stat) => (
                  <option key={stat.value} value={stat.value}>
                    {stat.value}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaCalendarAlt className="inline w-4 h-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaCalendarAlt className="inline w-4 h-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaUsers className="inline w-4 h-4 mr-1" />
                Assign Students
              </label>
              <div
                className={`max-h-[200px] overflow-y-auto p-4 rounded-xl border ${
                  darkMode
                    ? "bg-dark-elevated/50 border-darkBorder/50"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {students && students.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => handleStudentSelection(student.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          selectedStudents.includes(student.id)
                            ? darkMode
                              ? "bg-primary-blue/20 border-primary-blue text-white"
                              : "bg-primary-blue/10 border-primary-blue text-primary-dark"
                            : darkMode
                            ? "bg-dark-card hover:bg-dark-hover border-transparent hover:border-darkBorder/50"
                            : "bg-white hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                              selectedStudents.includes(student.id)
                                ? "bg-primary-blue text-white"
                                : darkMode
                                ? "bg-dark-elevated text-text-light"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {student.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                selectedStudents.includes(student.id)
                                  ? darkMode
                                    ? "text-white"
                                    : "text-primary-dark"
                                  : darkMode
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {student.username}
                            </p>
                            {student.universityId && (
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-text-muted" : "text-gray-500"
                                }`}
                              >
                                ID: {student.universityId}
                              </p>
                            )}
                          </div>
                          {selectedStudents.includes(student.id) && (
                            <svg
                              className="w-5 h-5 text-primary-blue"
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className={`text-center py-8 ${
                      darkMode ? "text-text-muted" : "text-gray-500"
                    }`}
                  >
                    No students available
                  </p>
                )}
              </div>
              {selectedStudents.length > 0 && (
                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  {selectedStudents.length} student
                  {selectedStudents.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {}
          <div className="flex gap-3 pt-6 border-t border-darkBorder/30">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
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
                  Creating...
                </span>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
