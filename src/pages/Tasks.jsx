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
import {
  FaEdit,
  FaTasks,
  FaCalendarAlt,
  FaUser,
  FaProjectDiagram,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaPauseCircle,
  FaTimesCircle,
  FaFilter,
  FaSort,
} from "react-icons/fa";

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
  const [sortBy, setSortBy] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortedTasks, setSortedTasks] = useState([]);
  const [students, setStudents] = useState([]);

  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  useEffect(() => {
    if (studentsData && studentsData.students) {
      setStudents(studentsData.students);
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const studentList = users.filter((user) => user.role === "student");
      setStudents(studentList);
    }
  }, [studentsData]);

  const filteredTasks = useMemo(() => {
    if (!tasks || !currentUser) return [];

    let filtered = tasks.filter((task) => {
      if (currentUser.role === "student") {
        return (
          task.assignedStudent &&
          (task.assignedStudent.id === currentUser.id ||
            task.assignedStudent === currentUser.id)
        );
      }
      return true;
    });

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    return filtered;
  }, [tasks, currentUser, filterStatus]);

  useEffect(() => {
    if (!filteredTasks.length) {
      setSortedTasks([]);
      return;
    }

    const tasksCopy = [...filteredTasks];

    switch (sortBy) {
      case "status":
        const statusOrder = {
          "In Progress": 1,
          Pending: 2,
          "On Hold": 3,
          Completed: 4,
          Cancelled: 5,
        };
        tasksCopy.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case "project":
        tasksCopy.sort((a, b) => {
          const projectA = a.project?.title || "";
          const projectB = b.project?.title || "";
          return projectA.localeCompare(projectB);
        });
        break;
      case "dueDate":
        tasksCopy.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case "student":
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

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshTasks();
    }, 5000);

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

  const handleStatusChange = async (taskId, newStatus) => {
    if (currentUser.role !== "admin") {
      const task = tasks.find((t) => t.id === taskId);

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

  const canAddTasks = currentUser && currentUser.role === "admin";

  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      let date;
      if (!isNaN(Number(input)) && String(input).length > 8) {
        date = new Date(Number(input));
      } else {
        date = new Date(input);
      }

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "for input:", input);
      return "Invalid Date";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="w-5 h-5" />;
      case "In Progress":
        return <FaSpinner className="w-5 h-5 animate-spin" />;
      case "Pending":
        return <FaClock className="w-5 h-5" />;
      case "On Hold":
        return <FaPauseCircle className="w-5 h-5" />;
      case "Cancelled":
        return <FaTimesCircle className="w-5 h-5" />;
      default:
        return <FaTasks className="w-5 h-5" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "On Hold":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getDueDateStyle = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-400";
    if (diffDays <= 3) return "text-yellow-400";
    return darkMode ? "text-text-muted" : "text-gray-500";
  };

  const statusOptions = [
    { value: "all", label: "All Tasks", count: tasks.length },
    {
      value: "In Progress",
      label: "In Progress",
      count: tasks.filter((t) => t.status === "In Progress").length,
    },
    {
      value: "Pending",
      label: "Pending",
      count: tasks.filter((t) => t.status === "Pending").length,
    },
    {
      value: "Completed",
      label: "Completed",
      count: tasks.filter((t) => t.status === "Completed").length,
    },
    {
      value: "On Hold",
      label: "On Hold",
      count: tasks.filter((t) => t.status === "On Hold").length,
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      count: tasks.filter((t) => t.status === "Cancelled").length,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Task Management
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-text-muted" : "text-gray-500"
            }`}
          >
            Manage and track all project tasks
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Status Filter Pills */}
          <div className="flex-1 flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border ${
                  filterStatus === option.value
                    ? darkMode
                      ? "bg-primary-blue/20 text-primary-blue border-primary-blue"
                      : "bg-primary-blue/10 text-primary-blue border-primary-blue"
                    : darkMode
                    ? "bg-dark-elevated text-text-light border-darkBorder/50 hover:border-primary-blue/50"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:border-primary-blue/50"
                }`}
              >
                {option.label}
                <span
                  className={`ml-2 text-xs ${
                    filterStatus === option.value
                      ? ""
                      : darkMode
                      ? "text-text-muted"
                      : "text-gray-500"
                  }`}
                >
                  ({option.count})
                </span>
              </button>
            ))}
          </div>

          {/* Sort and Add Button */}
          <div className="flex gap-3">
            <div className="relative">
              <FaSort
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? "text-text-muted" : "text-gray-400"
                }`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl font-medium ${
                  darkMode
                    ? "bg-dark-elevated text-white"
                    : "bg-white text-gray-900"
                } border ${
                  darkMode ? "border-darkBorder/50" : "border-gray-200"
                } focus:border-primary-blue cursor-pointer`}
              >
                <option value="status">Sort by Status</option>
                <option value="project">Sort by Project</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="student">Sort by Student</option>
              </select>
            </div>

            {canAddTasks && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary whitespace-nowrap"
              >
                <FaTasks className="w-4 h-4" />
                New Task
              </button>
            )}
          </div>
        </div>

        {/* Tasks Table */}
        {tasksLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin h-10 w-10 text-primary-blue"
                viewBox="0 0 24 24"
              >
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
              <p className={darkMode ? "text-text-muted" : "text-gray-500"}>
                Loading tasks...
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`overflow-hidden rounded-2xl shadow-soft ${
              darkMode ? "bg-dark-card" : "bg-white"
            } border ${darkMode ? "border-darkBorder/30" : "border-gray-200"}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      darkMode
                        ? "border-darkBorder/30 bg-dark-elevated/50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Task
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Project
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Assigned To
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Due Date
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder/20">
                  {sortedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className={`group transition-all duration-200 ${
                        darkMode
                          ? "hover:bg-dark-elevated/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {task.name}
                          </p>
                          <p
                            className={`text-sm mt-1 line-clamp-1 ${
                              darkMode ? "text-text-muted" : "text-gray-500"
                            }`}
                          >
                            {task.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram
                            className={`w-3.5 h-3.5 ${
                              darkMode
                                ? "text-primary-blue"
                                : "text-primary-dark"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              darkMode ? "text-text-light" : "text-gray-700"
                            }`}
                          >
                            {task.project?.title ||
                              getProjectName(task.projectId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                            darkMode ? "bg-dark-elevated" : "bg-gray-100"
                          }`}
                        >
                          <FaUser className="w-3 h-3" />
                          <span
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {task.assignedStudent?.username ||
                              task.assignedStudent}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt
                            className={`w-3.5 h-3.5 ${getDueDateStyle(
                              task.dueDate
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getDueDateStyle(
                              task.dueDate
                            )}`}
                          >
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(currentUser.role === "admin" ||
                            (currentUser.role === "student" &&
                              task.assignedStudent?.id === currentUser.id)) && (
                            <>
                              <button
                                onClick={() => handleEditTask(task)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  darkMode
                                    ? "hover:bg-dark-elevated text-text-muted hover:text-white"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                }`}
                                title="Edit task"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>

                              {currentUser.role === "student" &&
                                task.assignedStudent?.id === currentUser.id && (
                                  <>
                                    {task.status !== "Completed" ? (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            task.id,
                                            "Completed"
                                          )
                                        }
                                        className="btn-success px-3 py-1.5 text-xs"
                                      >
                                        <FaCheckCircle className="w-3.5 h-3.5" />
                                        Complete
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            task.id,
                                            "In Progress"
                                          )
                                        }
                                        className="btn-primary px-3 py-1.5 text-xs"
                                      >
                                        <FaSpinner className="w-3.5 h-3.5" />
                                        Reopen
                                      </button>
                                    )}
                                  </>
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

            {!tasksLoading && sortedTasks.length === 0 && (
              <div className="text-center py-16">
                <FaTasks
                  className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? "text-text-muted" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-lg font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No tasks found
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  {filterStatus !== "all"
                    ? "Try changing your filters"
                    : "Create a new task to get started"}
                </p>
              </div>
            )}
          </div>
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
