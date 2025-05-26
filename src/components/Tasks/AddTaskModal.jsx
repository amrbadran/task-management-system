import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  FaTimes,
  FaTasks,
  FaProjectDiagram,
  FaUser,
  FaCalendarAlt,
  FaFlag,
  FaFileAlt,
} from "react-icons/fa";

const AddTaskModal = ({ isOpen, onClose, onAddTask, projects, students }) => {
  const { darkMode } = useContext(ThemeContext);
  const [projectId, setProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedStudent, setAssignedStudent] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = [
    { value: "Pending", color: "yellow", icon: "🕐" },
    { value: "In Progress", color: "blue", icon: "🔄" },
    { value: "Completed", color: "green", icon: "✅" },
    { value: "On Hold", color: "gray", icon: "⏸️" },
    { value: "Cancelled", color: "red", icon: "❌" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(dueDate) < new Date()) {
      setError("Due date must be in the future");
      return;
    }

    setLoading(true);

    try {
      const projectIdValue = projectId;

      const studentObj = students.find(
        (student) => student.id === assignedStudent
      );

      await onAddTask({
        projectId: projectIdValue,
        name: taskName,
        description,
        assignedStudent: assignedStudent,
        status,
        dueDate,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Task creation error:", error);
      setError(error.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProjectId("");
    setTaskName("");
    setDescription("");
    setAssignedStudent("");
    setStatus("Pending");
    setDueDate("");
    setError("");
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-primary-green/20" : "bg-primary-green/10"
              }`}
            >
              <FaTasks className="w-6 h-6 text-primary-green" />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Create New Task
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? "text-text-muted" : "text-gray-500"
                }`}
              >
                Add a new task to your project
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaProjectDiagram className="inline w-4 h-4 mr-1" />
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              >
                <option value="">Select a project</option>
                {projects &&
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaTasks className="inline w-4 h-4 mr-1" />
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaFileAlt className="inline w-4 h-4 mr-1" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the task"
                rows={4}
                required
                disabled={loading}
                className="w-full resize-none"
              />
            </div>

            {/* Assigned Student */}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaUser className="inline w-4 h-4 mr-1" />
                Assign To
              </label>
              <select
                value={assignedStudent}
                onChange={(e) => setAssignedStudent(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              >
                <option value="">Select a student</option>
                {students &&
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.username}
                      {student.universityId && ` (${student.universityId})`}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaCalendarAlt className="inline w-4 h-4 mr-1" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={loading}
                className="w-full"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-text-light" : "text-gray-700"
                }`}
              >
                <FaFlag className="inline w-4 h-4 mr-1" />
                Initial Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    disabled={loading}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      status === option.value
                        ? option.color === "blue"
                          ? "bg-blue-500/20 border-blue-500 text-blue-400"
                          : option.color === "green"
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : option.color === "yellow"
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                          : option.color === "gray"
                          ? "bg-gray-500/20 border-gray-500 text-gray-400"
                          : "bg-red-500/20 border-red-500 text-red-400"
                        : darkMode
                        ? "bg-dark-elevated border-darkBorder/50 hover:border-primary-blue/50"
                        : "bg-gray-50 border-gray-200 hover:border-primary-blue/50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs font-medium">{option.value}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
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
              className="btn-success flex-1"
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
                <>
                  <FaTasks className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
