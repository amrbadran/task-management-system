import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaTimes } from "react-icons/fa";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate due date
    if (new Date(dueDate) < new Date()) {
      setError("Due date must be in the future");
      return;
    }

    setLoading(true);

    try {
      // Make sure we're just using the ID string, not the full project object
      const projectIdValue = projectId;

      // Find assigned student object by ID
      const studentObj = students.find(
        (student) => student.id === assignedStudent
      );

      // Create task with proper data types
      await onAddTask({
        projectId: projectIdValue,
        name: taskName,
        description,
        assignedStudent: assignedStudent, // Just pass the ID
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full max-w-[500px] ${
          darkMode ? "bg-dark-darker" : "bg-light-darker"
        } rounded-lg p-5 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-medium text-primary-blue`}>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className={`bg-transparent border-none ${
              darkMode ? "text-white" : "text-gray-800"
            } text-2xl cursor-pointer`}
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Project:
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer`}
              required
              disabled={loading}
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

          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Task Name:
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
              disabled={loading}
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Assigned Student:
            </label>
            <select
              value={assignedStudent}
              onChange={(e) => setAssignedStudent(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer`}
              required
              disabled={loading}
            >
              <option value="">Select a student</option>
              {students &&
                students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.username}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer`}
              required
              disabled={loading}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Due Date:
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full p-3 rounded ${
                darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
              } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-green hover:bg-green-600 text-white font-medium rounded cursor-pointer transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
