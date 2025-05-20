import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FaTimes } from "react-icons/fa";

const EditProjectModal = ({ isOpen, onClose, onUpdateProject, project, students }) => {
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

    // Populate form with project data when project changes
    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);

            // Handle students
            const studentIds = project.students.map(student =>
                typeof student === 'string' ? student : student.id
            );
            setSelectedStudents(studentIds);

            setCategory(project.category);

            // Handle dates - convert timestamps if necessary
            try {
                if (project.startDate) {
                    // Check if it's a Unix timestamp
                    if (!isNaN(Number(project.startDate)) && String(project.startDate).length > 8) {
                        const date = new Date(Number(project.startDate));
                        if (!isNaN(date.getTime())) {
                            // Format as YYYY-MM-DD for the input
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            setStartDate(`${year}-${month}-${day}`);
                        } else {
                            setStartDate("");
                        }
                    } else {
                        // Try as a regular date string
                        const date = new Date(project.startDate);
                        if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            setStartDate(`${year}-${month}-${day}`);
                        } else {
                            setStartDate("");
                        }
                    }
                }

                if (project.endDate) {
                    // Check if it's a Unix timestamp
                    if (!isNaN(Number(project.endDate)) && String(project.endDate).length > 8) {
                        const date = new Date(Number(project.endDate));
                        if (!isNaN(date.getTime())) {
                            // Format as YYYY-MM-DD for the input
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            setEndDate(`${year}-${month}-${day}`);
                        } else {
                            setEndDate("");
                        }
                    } else {
                        // Try as a regular date string
                        const date = new Date(project.endDate);
                        if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            setEndDate(`${year}-${month}-${day}`);
                        } else {
                            setEndDate("");
                        }
                    }
                }
            } catch (err) {
                console.error("Error parsing dates:", err);
            }

            setStatus(project.status);
        }
    }, [project]);

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
            await onUpdateProject(project.id, {
                title,
                description,
                students: selectedStudents,
                category,
                startDate,
                endDate,
                status,
            });

            onClose();
        } catch (error) {
            setError(error.message || "Failed to update project");
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
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
                    } rounded-lg p-5 shadow-lg overflow-y-auto max-h-[90vh]`}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-medium text-primary-blue">
                        Edit Project
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
                            Project Title:
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            Project Description:
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
                            Students List:
                        </label>
                        <div
                            className={`max-h-[150px] overflow-y-auto p-2 rounded ${darkMode ? "bg-dark-card" : "bg-white"
                                }`}
                        >
                            {students && students.length > 0 ? (
                                students.map((student) => (
                                    <div
                                        key={student.id}
                                        className={`flex items-center p-2 mb-1 rounded cursor-pointer
                      ${selectedStudents.includes(student.id)
                                                ? "bg-primary-blue text-white"
                                                : darkMode
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => handleStudentSelection(student.id)}
                                    >
                                        <span>
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
                                    className={`p-2 ${darkMode ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    No students available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Project Category:
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="DevOps">DevOps</option>
                            <option value="UX/UI Design">UX/UI Design</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            className={`block mb-2 ${darkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Starting Date:
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
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
                            Ending Date:
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
                            Project Status:
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`w-full p-3 rounded ${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                                } border-none focus:outline-none focus:ring-2 focus:ring-primary-blue`}
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

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-blue hover:bg-blue-600 text-white font-medium rounded cursor-pointer transition-colors duration-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal; 