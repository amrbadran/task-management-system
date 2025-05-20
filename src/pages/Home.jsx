import { useContext, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MainLayout from "../components/Layout/MainLayout";
import StatCard from "../components/Dashboard/StatCard";
import { ProjectContext } from "../contexts/ProjectContext";
import { TaskContext } from "../contexts/TaskContext";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { GET_STUDENTS } from "../utils/graphql/queries";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Fetch students data using GraphQL
  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  useEffect(() => {
    // Update date/time
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let studentCount = 0;

    // Get student count from GraphQL API
    if (studentsData && studentsData.students) {
      studentCount = studentsData.students.filter(student => student.role === "student").length;
    } else {
      // Fallback to localStorage if GraphQL is not available
      const users = JSON.parse(localStorage.getItem("users")) || [];
      studentCount = users.filter((user) => user.role === "student").length;
    }

    // Calculate statistics
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

  // Prepare chart data
  const chartData = {
    labels: ["Projects", "Students", "Tasks", "Finished Projects"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.projectCount,
          stats.studentCount,
          stats.taskCount,
          stats.finishedProjectCount,
        ],
        backgroundColor: [
          "rgba(41,63,62,255)",
          "rgba(37,57,71,255)",
          "rgba(75,65,42,255)",
          "rgba(55,44,75,255)",
        ],
        borderColor: ["#4cc1c0", "#3386be", "#e2b84f", "#9261f1"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#333333",
        },
      },
      x: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#333333",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#ffffff" : "#333333",
        },
      },
      title: {
        display: true,
        text: "Admin Dashboard Overview",
        color: darkMode ? "#ffffff" : "#333333",
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-primary-blue mb-4 md:mb-0">
            Welcome to the Task Management System
            {currentUser && `, ${currentUser.username}`}
          </h2>
          <p
            className={`text-right ${darkMode ? "text-text-light" : "text-gray-600"
              }`}
          >
            {currentDateTime}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Number of Projects" value={stats.projectCount} />
          <StatCard title="Number of Students" value={stats.studentCount} />
          <StatCard title="Number of Tasks" value={stats.taskCount} />
          <StatCard
            title="Number of Finished Projects"
            value={stats.finishedProjectCount}
          />
        </div>

        <div
          className={`${darkMode ? "bg-dark-card" : "bg-light-card"
            } rounded-lg p-5 shadow-md transition-colors duration-300`}
        >
          <h3
            className={`mb-4 text-center ${darkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Admin Dashboard Overview
          </h3>
          <div className="h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
