import { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import MainLayout from "../components/Layout/MainLayout";
import StatCard from "../components/Dashboard/StatCard";
import Chart from "../components/Dashboard/Chart";
import { ProjectContext } from "../contexts/ProjectContext";
import { TaskContext } from "../contexts/TaskContext";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { GET_STUDENTS } from "../utils/graphql/queries";
import {
  FaProjectDiagram,
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const Home = () => {
  const { projects } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    projectCount: 0,
    studentCount: 0,
    taskCount: 0,
    finishedProjectCount: 0,
  });
  const [currentDateTime, setCurrentDateTime] = useState("");

  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let studentCount = 0;

    if (studentsData && studentsData.students) {
      studentCount = studentsData.students.filter(
        (student) => student.role === "student"
      ).length;
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      studentCount = users.filter((user) => user.role === "student").length;
    }

    const projectCount = projects.length;
    const taskCount = tasks.length;
    const finishedProjectCount = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    setStats({
      projectCount,
      studentCount,
      taskCount,
      finishedProjectCount,
    });
  }, [projects, tasks, studentsData]);

  const updateDateTime = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const now = new Date();
    setCurrentDateTime(now.toLocaleDateString("en-US", options));
  };

  const chartData = [
    { name: "Projects", count: stats.projectCount },
    { name: "Students", count: stats.studentCount },
    { name: "Tasks", count: stats.taskCount },
    { name: "Finished Projects", count: stats.finishedProjectCount },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gradient">Welcome back</span>
                {currentUser && (
                  <span className={darkMode ? "text-white" : "text-gray-900"}>
                    , {currentUser.username}
                  </span>
                )}
              </h1>
              <p
                className={`text-lg ${
                  darkMode ? "text-text-muted" : "text-gray-600"
                }`}
              >
                Manage your projects and tasks efficiently
              </p>
            </div>
            <div
              className={`text-right ${
                darkMode ? "text-text-light" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaClock
                  className={`w-4 h-4 ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                />
                <p className="text-sm font-medium">{currentDateTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.projectCount}
            icon={FaProjectDiagram}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Active Students"
            value={stats.studentCount}
            icon={FaUsers}
            gradient="from-green-500 to-teal-500"
          />
          <StatCard
            title="Total Tasks"
            value={stats.taskCount}
            icon={FaTasks}
            gradient="from-orange-500 to-red-500"
          />
          <StatCard
            title="Completed Projects"
            value={stats.finishedProjectCount}
            icon={FaCheckCircle}
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Chart Section */}
        <Chart data={chartData} />

        {/* Recent Activity Section - Optional Enhancement */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div
            className={`${
              darkMode ? "bg-dark-card" : "bg-white"
            } rounded-2xl p-6 shadow-soft border ${
              darkMode ? "border-darkBorder/30" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Projects
            </h3>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    darkMode ? "bg-dark-elevated" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {project.title}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      {project.students.length} students
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : project.status === "In Progress"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              ))}
              {projects.length === 0 && (
                <p
                  className={`text-center py-8 ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  No projects yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div
            className={`${
              darkMode ? "bg-dark-card" : "bg-white"
            } rounded-2xl p-6 shadow-soft border ${
              darkMode ? "border-darkBorder/30" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Tasks
            </h3>
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    darkMode ? "bg-dark-elevated" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {task.name}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      {task.assignedStudent?.username || "Unassigned"}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      task.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : task.status === "In Progress"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
              {tasks.length === 0 && (
                <p
                  className={`text-center py-8 ${
                    darkMode ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  No tasks yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
