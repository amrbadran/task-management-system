import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaTimes } from "react-icons/fa";

const EditTaskModal = ({ isOpen, onClose, onUpdateTask, task, projects, students }) => {
    const { darkMode } = useContext(ThemeContext);
    const [projectId, setProjectId] = useState("");
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [assignedStudent, setAssignedStudent] = useState("");
    const [status, setStatus] = useState("Pending");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Populate form with task data when task changes
    useEffect(() => {
        if (task) {
            setProjectId(task.projectId);
            setTaskName(task.name);
            setDescription(task.description);
            setAssignedStudent(task.assignedStudent?.id || "");
            setStatus(task.status);

            // Safely format date to YYYY-MM-DD for input
            try {
                if (task.dueDate) {
                    // Try parsing the date, handling both ISO strings and timestamps
                    let date;

                    // Check if it's a Unix timestamp (number or numeric string)
                    if (!isNaN(Number(task.dueDate)) && String(task.dueDate).length > 8) {
                        // Likely a Unix timestamp in milliseconds
                        date = new Date(Number(task.dueDate));
                    } else {
                        // Try as a regular date string
                        date = new Date(task.dueDate);
                    }

                    // Check if date is valid
                    if (!isNaN(date.getTime())) {
                        // Format as YYYY-MM-DD
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setDueDate(`${year}-${month}-${day}`);
                        console.log(`Formatted date for edit: ${task.dueDate} -> ${year}-${month}-${day}`);
                    } else {
                        console.error("Invalid date format:", task.dueDate);
                        setDueDate("");
                    }
                } else {
                    setDueDate("");
                }
            } catch (err) {
                console.error("Error parsing date:", err);
                setDueDate("");
            }
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate due date
        const selectedDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

        if (isNaN(selectedDate.getTime())) {
            setError("Please enter a valid date");
            return;
        }

        if (selectedDate < today) {
            setError("Due date must be today or in the future");
            return;
        }

        setLoading(true);

        try {
            // Update task with proper data types
            await onUpdateTask(task.id, {
                name: taskName,
                description,
                assignedStudent: assignedStudent,
                status,
                dueDate,
            });

            onClose();
        } catch (error) {
            console.error("Task update error:", error);
            setError(error.message || "Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            <div
                className={`relative w-full max-w-[500px] ${darkMode ? "bg-dark-darker" : "bg-light-darker"
                    } rounded-lg p-5 shadow-lg`}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className={`text-xl font-medium text-primary-blue`}>
                        Edit Task
                    </h2>
                    <button
                        onClick={onClose}
                        className={`bg-transparent border-none ${darkMode ? "text-white" : "text-gray-800"
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
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Project:
                        </label>
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer`}
                            required
                            disabled={true} // Disable changing project
                        >
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
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Task Name:
                        </label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Description:
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                            disabled={loading}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Assigned Student:
                        </label>
                        <select
                            value={assignedStudent}
                            onChange={(e) => setAssignedStudent(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
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
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Status:
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
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
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Due Date:
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-blue hover:bg-blue-600 text-white font-medium rounded cursor-pointer transition-colors duration-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal; 