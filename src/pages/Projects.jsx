import { useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import MainLayout from "../components/Layout/MainLayout";
import ProjectCard from "../components/Projects/ProjectCard";
import AddProjectModal from "../components/Projects/AddProjectModal";
import EditProjectModal from "../components/Projects/EditProjectModal";
import { ProjectContext } from "../contexts/ProjectContext";
import { GET_PROJECT, GET_STUDENTS } from "../utils/graphql/queries";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaEdit, FaTasks } from "react-icons/fa";

const Projects = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    projects,
    addProject,
    updateProject,
    loading: projectsLoading,
  } = useContext(ProjectContext);
  const { darkMode } = useContext(ThemeContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [students, setStudents] = useState([]);

  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { id: selectedProject?.id },
    skip: !selectedProject?.id,
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

  useEffect(() => {
    if (projectData && projectData.project) {
      setSelectedProject(projectData.project);
    }
  }, [projectData]);

  useEffect(() => {
    let filtered = projects.filter((project) => {
      if (currentUser.role === "student") {
        return project.students.some(
          (student) => student.id === currentUser.id
        );
      }
      return true;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, currentUser]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleAddProject = async (projectData) => {
    try {
      await addProject(projectData);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
      return Promise.reject(error);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = async (id, updatedData) => {
    try {
      await updateProject(id, updatedData);
      setShowEditModal(false);
      setEditingProject(null);

      if (selectedProject && selectedProject.id === id) {
        await refetch();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      return Promise.reject(error);
    }
  };

  const canManageProjects = currentUser && currentUser.role === "admin";

  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      const date = new Date(Number(input));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        {selectedProject ? (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  {selectedProject.title}
                </h1>
                <p
                  className={`text-lg ${
                    darkMode ? "text-text-muted" : "text-gray-600"
                  }`}
                >
                  Project Details
                </p>
              </div>
              <div className="flex gap-3">
                {canManageProjects && (
                  <button
                    onClick={() => handleEditProject(selectedProject)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Project
                  </button>
                )}
                <button
                  onClick={handleBackToProjects}
                  className="btn-secondary flex items-center gap-2"
                >
                  Back to Projects
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Info Card */}
              <div
                className={`lg:col-span-2 ${
                  darkMode ? "bg-dark-card" : "bg-white"
                } rounded-2xl p-8 shadow-soft border ${
                  darkMode ? "border-darkBorder/30" : "border-gray-200"
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <h3
                      className={`text-sm font-semibold mb-2 ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Description
                    </h3>
                    <p
                      className={`text-base leading-relaxed ${
                        darkMode ? "text-text-light" : "text-gray-700"
                      }`}
                    >
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="divider" />

                  <div>
                    <h3
                      className={`text-sm font-semibold mb-3 ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Assigned Students
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.students.map((student, index) => (
                        <div
                          key={index}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                            darkMode ? "bg-dark-elevated" : "bg-gray-100"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                              darkMode
                                ? "bg-primary-blue/20 text-primary-blue"
                                : "bg-primary-blue/10 text-primary-dark"
                            }`}
                          >
                            {(typeof student === "string"
                              ? student
                              : student.username
                            )
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {typeof student === "string"
                              ? student
                              : student.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="divider" />

                  <div>
                    <h3
                      className={`text-sm font-semibold mb-3 ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Timeline
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-xl ${
                          darkMode ? "bg-dark-elevated" : "bg-gray-50"
                        }`}
                      >
                        <p
                          className={`text-xs font-medium mb-1 ${
                            darkMode ? "text-text-muted" : "text-gray-500"
                          }`}
                        >
                          Start Date
                        </p>
                        <p
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatDate(selectedProject.startDate)}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-xl ${
                          darkMode ? "bg-dark-elevated" : "bg-gray-50"
                        }`}
                      >
                        <p
                          className={`text-xs font-medium mb-1 ${
                            darkMode ? "text-text-muted" : "text-gray-500"
                          }`}
                        >
                          End Date
                        </p>
                        <p
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatDate(selectedProject.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="space-y-6">
                <div
                  className={`${
                    darkMode ? "bg-dark-card" : "bg-white"
                  } rounded-2xl p-6 shadow-soft border ${
                    darkMode ? "border-darkBorder/30" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      darkMode ? "text-text-muted" : "text-gray-500"
                    }`}
                  >
                    Project Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-text-light" : "text-gray-600"
                        }`}
                      >
                        Current Status
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          selectedProject.status === "Completed"
                            ? "bg-green-500/20 text-green-500 border border-green-500/30"
                            : selectedProject.status === "In Progress"
                            ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                            : selectedProject.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                            : selectedProject.status === "On Hold"
                            ? "bg-gray-500/20 text-gray-500 border border-gray-500/30"
                            : "bg-red-500/20 text-red-500 border border-red-500/30"
                        }`}
                      >
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-text-light" : "text-gray-600"
                        }`}
                      >
                        Category
                      </span>
                      <span
                        className={`text-sm font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${
                          selectedProject.category === "Web Development"
                            ? "from-blue-500 to-cyan-500"
                            : selectedProject.category === "Mobile Development"
                            ? "from-yellow-500 to-orange-500"
                            : selectedProject.category === "Data Science"
                            ? "from-purple-500 to-pink-500"
                            : selectedProject.category === "Machine Learning"
                            ? "from-green-500 to-teal-500"
                            : selectedProject.category === "DevOps"
                            ? "from-red-500 to-rose-500"
                            : selectedProject.category === "UX/UI Design"
                            ? "from-indigo-500 to-purple-500"
                            : "from-gray-500 to-slate-500"
                        } text-white`}
                      >
                        {selectedProject.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-dark-card" : "bg-white"
                  } rounded-2xl p-6 shadow-soft border ${
                    darkMode ? "border-darkBorder/30" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      darkMode ? "text-text-muted" : "text-gray-500"
                    }`}
                  >
                    Progress Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span
                        className={`text-3xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedProject.progress}%
                      </span>
                      <span
                        className={`text-xs ${
                          darkMode ? "text-text-muted" : "text-gray-500"
                        }`}
                      >
                        Complete
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-text-muted" : "text-gray-500"
                      }`}
                    >
                      Based on completed tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Project Tasks
              </h2>

              {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${
                        darkMode ? "bg-dark-card" : "bg-white"
                      } rounded-2xl p-6 shadow-soft border ${
                        darkMode ? "border-darkBorder/30" : "border-gray-200"
                      } hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4
                          className={`font-semibold text-lg ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {task.name}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === "Completed"
                              ? "bg-green-500/20 text-green-500 border border-green-500/30"
                              : task.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                              : task.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                              : task.status === "On Hold"
                              ? "bg-gray-500/20 text-gray-500 border border-gray-500/30"
                              : "bg-red-500/20 text-red-500 border border-red-500/30"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-4 ${
                          darkMode ? "text-text-light" : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                            darkMode
                              ? "bg-dark-elevated text-text-light"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {(
                            task.assignedStudent?.username ||
                            task.assignedStudent ||
                            "UN"
                          )
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-text-muted" : "text-gray-500"
                          }`}
                        >
                          {task.assignedStudent?.username ||
                            task.assignedStudent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-center py-16 ${
                    darkMode ? "bg-dark-card" : "bg-white"
                  } rounded-2xl border ${
                    darkMode ? "border-darkBorder/30" : "border-gray-200"
                  }`}
                >
                  <FaTasks
                    className={`w-16 h-16 mx-auto mb-4 ${
                      darkMode ? "text-text-muted" : "text-gray-300"
                    }`}
                  />
                  <p className={darkMode ? "text-text-muted" : "text-gray-500"}>
                    No tasks found for this project
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-primary-blue mb-4 md:mb-0">
                Projects Overview
              </h2>
              {canManageProjects && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-primary-blue hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
                >
                  Add New Project
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleProjectClick}
                  onEdit={canManageProjects ? handleEditProject : null}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {canManageProjects && (
        <>
          <AddProjectModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddProject={handleAddProject}
            students={students}
          />

          <EditProjectModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingProject(null);
            }}
            onUpdateProject={handleUpdateProject}
            project={editingProject}
            students={students}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Projects;
