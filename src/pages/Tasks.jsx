import { useState, useContext, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import MainLayout from "../components/Layout/MainLayout";
import AddTaskModal from "../components/Tasks/AddTaskModal";
import EditTaskModal from "../components/Tasks/EditTaskModal";
import { TaskContext } from "../contexts/TaskContext";
import { ProjectContext } from "../contexts/ProjectContext";
import { GET_STUDENTS } from "../utils/graphql/queries";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaEdit } from "react-icons/fa";

const Tasks = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    tasks,
    addTask,
    updateTask,
    refreshTasks,
    loading: tasksLoading,
  } = useContext(TaskContext);
  const { projects } = useContext(ProjectContext);
  const { darkMode } = useContext(ThemeContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState("Task Status");
  const [sortedTasks, setSortedTasks] = useState([]);
  const [students, setStudents] = useState([]);

  // Query students for task assignment
  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  // Update students list when data changes
  useEffect(() => {
    if (studentsData && studentsData.students) {
      setStudents(studentsData.students);
    } else {
      // Fallback to localStorage if GraphQL is not working
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const studentList = users.filter((user) => user.role === "student");
      setStudents(studentList);
    }
  }, [studentsData]);

  // Filter tasks based on user role - using useMemo for performance
  const filteredTasks = useMemo(() => {
    if (!tasks || !currentUser) return [];

    return tasks.filter((task) => {
      if (currentUser.role === "student") {
        // Check if task has an assigned student and if it matches the current user
        return (
          task.assignedStudent &&
          (task.assignedStudent.id === currentUser.id ||
            task.assignedStudent === currentUser.id)
        );
      }
      return true; // Admins can see all tasks
    });
  }, [tasks, currentUser]);

  // Sort tasks when sorting criteria or filtered tasks change
  useEffect(() => {
    if (!filteredTasks.length) return;

    const tasksCopy = [...filteredTasks];

    // Sort tasks based on sortBy
    switch (sortBy) {
      case "Task Status":
        const statusOrder = {
          Completed: 1,
          "In Progress": 2,
          Pending: 3,
          "On Hold": 4,
          Cancelled: 5,
        };
        tasksCopy.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case "Project":
        tasksCopy.sort((a, b) => {
          const projectA = a.project?.title || "";
          const projectB = b.project?.title || "";
          return projectA.localeCompare(projectB);
        });
        break;
      case "Due Date":
        tasksCopy.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case "Assigned Student":
        tasksCopy.sort((a, b) => {
          const studentA = a.assignedStudent?.username || "";
          const studentB = b.assignedStudent?.username || "";
          return studentA.localeCompare(studentB);
        });
        break;
      default:
        break;
    }

    setSortedTasks(tasksCopy);
  }, [filteredTasks, sortBy]);

  // Periodically refresh tasks to ensure up-to-date data
  useEffect(() => {
    // Set up an interval to refresh tasks every 5 seconds
    const refreshInterval = setInterval(() => {
      refreshTasks();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [refreshTasks]);

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.title : "Unknown Project";
  };

  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      return Promise.reject(error);
    }
  };

  // Student can only update their own task status
  const handleStatusChange = async (taskId, newStatus) => {
    if (currentUser.role !== "admin") {
      // Find the task
      const task = tasks.find((t) => t.id === taskId);

      // Check if student is assigned to this task
      if (task && task.assignedStudent.id !== currentUser.id) {
        console.error("You can only update your own tasks");
        return;
      }
    }

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      await updateTask(id, updatedData);
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      return Promise.reject(error);
    }
  };

  // Only admins can add tasks
  const canAddTasks = currentUser && currentUser.role === "admin";

  // Helper function to safely format dates
  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      // Handle different date formats (ISO string, Unix timestamp)
      let date;

      // Check if input is a Unix timestamp (number or numeric string)
      if (!isNaN(Number(input)) && String(input).length > 8) {
        // Likely a Unix timestamp in milliseconds
        date = new Date(Number(input));
      } else {
        // Try as a regular date string
        date = new Date(input);
      }

      if (isNaN(date.getTime())) return "Invalid Date"; // Invalid date check

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "for input:", input);
      return "Invalid Date";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-500";
      case "In Progress":
        return "text-blue-500";
      case "Pending":
        return "text-yellow-500";
      case "On Hold":
        return "text-gray-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getStatusPill = (status) => {
    const baseClasses =
      "inline-block px-2.5 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "Completed":
        return `${baseClasses} bg-primary-green text-white`;
      case "In Progress":
        return `${baseClasses} bg-primary-blue text-white`;
      case "Pending":
        return `${baseClasses} bg-primary-orange text-dark-bg`;
      case "On Hold":
        return `${baseClasses} bg-gray-500 text-white`;
      case "Cancelled":
        return `${baseClasses} bg-primary-red text-white`;
      default:
        return baseClasses;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <label
              className={`mr-2 ${darkMode ? "text-gray-300" : "text-gray-800 font-medium"}`}
            >
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`${darkMode ? "bg-dark-card text-white" : "bg-white text-gray-800"
                } p-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer transition-colors duration-300`}
            >
              <option value="Task Status">Task Status</option>
              <option value="Project">Project</option>
              <option value="Due Date">Due Date</option>
              <option value="Assigned Student">Assigned Student</option>
            </select>
          </div>

          {canAddTasks && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-blue hover:bg-blue-700 text-white rounded transition-colors duration-300"
            >
              Create a New Task
            </button>
          )}
        </div>

        {tasksLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className={darkMode ? "text-white" : "text-gray-800"}>
              Loading tasks...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className={`min-w-full ${darkMode ? "bg-dark-card" : "bg-white"
                } rounded-lg ${darkMode ? "shadow-md" : "shadow-lg border border-gray-200"} transition-colors duration-300`}
            >
              <thead>
                <tr
                  className={`${darkMode
                    ? "border-b border-gray-700 text-gray-200"
                    : "border-b border-gray-200 text-gray-800 bg-gray-100"
                    }`}
                >
                  <th className="py-3 px-4 text-left">Task ID</th>
                  <th className="py-3 px-4 text-left">Project</th>
                  <th className="py-3 px-4 text-left">Task Name</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Assigned Student</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`
                      ${darkMode
                        ? "border-b border-gray-700 hover:bg-gray-800 text-gray-200"
                        : "border-b border-gray-200 hover:bg-gray-50 text-gray-700"
                      }
                      transition-colors duration-200
                    `}
                  >
                    <td className="py-3 px-4">{task.id}</td>
                    <td className="py-3 px-4">
                      {task.project?.title || getProjectName(task.projectId)}
                    </td>
                    <td className="py-3 px-4">{task.name}</td>
                    <td className="py-3 px-4">
                      {task.description.length > 50
                        ? `${task.description.substring(0, 50)}...`
                        : task.description}
                    </td>
                    <td className="py-3 px-4">
                      {task.assignedStudent?.username || task.assignedStudent}
                    </td>
                    <td className="py-3 px-4">
                      <span className={getStatusPill(task.status)}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {currentUser.role === "admin" && (
                          <button
                            onClick={() => handleEditTask(task)}
                            className="bg-primary-blue hover:bg-blue-700 text-white px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center"
                            title="Edit Task"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                        )}
                        {currentUser.role === "student" &&
                          task.assignedStudent?.id === currentUser.id && (
                            <>
                              <button
                                onClick={() => handleEditTask(task)}
                                className="bg-primary-blue hover:bg-blue-700 text-white px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center"
                                title="Edit Task"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              {task.status !== "Completed" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(task.id, "Completed")
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm transition-colors duration-200 ml-2"
                                >
                                  Mark Completed
                                </button>
                              )}
                              {task.status === "Completed" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(task.id, "In Progress")
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm transition-colors duration-200 ml-2"
                                >
                                  Reopen
                                </button>
                              )}
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!tasksLoading && sortedTasks.length === 0 && (
          <p className={`text-center mt-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No tasks found. Add a new task or change your filters.
          </p>
        )}
      </div>

      {canAddTasks && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddTask={handleAddTask}
          projects={projects}
          students={students}
        />
      )}

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onUpdateTask={handleUpdateTask}
        task={editingTask}
        projects={projects}
        students={students}
      />
    </MainLayout>
  );
};

export default Tasks;
