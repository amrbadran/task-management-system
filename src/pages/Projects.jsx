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
import { FaEdit } from "react-icons/fa";

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

  // Query students for project assignment
  const { data: studentsData } = useQuery(GET_STUDENTS, {
    skip: !currentUser,
  });

  // Query selected project details
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { id: selectedProject?.id },
    skip: !selectedProject?.id,
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

  // Update selected project when data changes
  useEffect(() => {
    if (projectData && projectData.project) {
      setSelectedProject(projectData.project);
    }
  }, [projectData]);

  // Apply filters to projects
  useEffect(() => {
    let filtered = projects.filter((project) => {
      if (currentUser.role === "student") {
        return project.students.some(
          (student) => student.id === currentUser.id
        );
      }
      return true; // Admins can see all projects
    });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
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

      // If we're currently viewing this project, update the selected project data
      if (selectedProject && selectedProject.id === id) {
        // Refetch the project data
        await refetch();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      return Promise.reject(error);
    }
  };

  // Only admins can add/edit projects
  const canManageProjects = currentUser && currentUser.role === "admin";

  // Helper function to safely format dates
  const formatDate = (input) => {
    if (!input) return "N/A";
    try {
      const date = new Date(Number(input)); // Works for both timestamp & ISO string
      if (isNaN(date.getTime())) return "N/A"; // Invalid date check
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
          // Project Detail View
          <div className="animate-fade-in">
            {projectLoading ? (
              <div className="flex items-center justify-center h-40">
                <p className={darkMode ? "text-white" : "text-gray-800"}>
                  Loading project details...
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-primary-blue">
                    {selectedProject.title}
                  </h1>
                  <div className="flex space-x-3">
                    {canManageProjects && (
                      <button
                        onClick={() => handleEditProject(selectedProject)}
                        className="px-5 py-2.5 bg-primary-blue hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FaEdit className="mr-2" /> Edit Project
                      </button>
                    )}
                    <button
                      onClick={handleBackToProjects}
                      className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Back to Projects
                    </button>
                  </div>
                </div>

                <div
                  className={`${darkMode ? "bg-dark-card" : "bg-white"
                    } p-8 rounded-xl shadow-lg mb-8 transition-all duration-300 border ${darkMode ? "border-gray-800" : "border-gray-100"
                    }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        Description
                      </p>
                      <p
                        className={`${darkMode ? "text-gray-300" : "text-gray-700"
                          } leading-relaxed`}
                      >
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        Category
                      </p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-primary-blue bg-opacity-20 text-primary-blue" : "bg-primary-blue bg-opacity-10 text-primary-blue"
                          }`}
                      >
                        {selectedProject.category}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        Students
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.students.map((student, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {typeof student === "string" ? student : student.username}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        Status
                      </p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${selectedProject.status === "Completed"
                            ? "bg-green-500 bg-opacity-20 text-green-500"
                            : selectedProject.status === "In Progress"
                              ? "bg-blue-500 bg-opacity-20 text-blue-500"
                              : selectedProject.status === "Pending"
                                ? "bg-yellow-500 bg-opacity-20 text-yellow-500"
                                : selectedProject.status === "On Hold"
                                  ? "bg-gray-500 bg-opacity-20 text-gray-500"
                                  : "bg-red-500 bg-opacity-20 text-red-500"
                          }`}
                      >
                        {selectedProject.status}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-3`}
                      >
                        Progress
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-blue to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          Based on completed tasks
                        </p>
                        <p className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {selectedProject.progress}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        Start Date
                      </p>
                      <p
                        className={`${darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {formatDate(selectedProject.startDate)}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`font-semibold text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                      >
                        End Date
                      </p>
                      <p
                        className={`${darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {formatDate(selectedProject.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary-blue mb-6">
                  Tasks
                </h2>

                {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedProject.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`${darkMode ? "bg-dark-card" : "bg-white"
                          } p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${darkMode ? "border-gray-800" : "border-gray-100"
                          }`}
                      >
                        <div
                          className={`font-semibold text-lg mb-3 ${darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {task.name}
                        </div>
                        <div
                          className={`mb-4 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          {task.description}
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                          >
                            Assigned to:{" "}
                            <span className="font-medium">
                              {task.assignedStudent.username ||
                                task.assignedStudent}
                            </span>
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === "Completed"
                                ? "bg-green-500 bg-opacity-20 text-green-500"
                                : task.status === "In Progress"
                                  ? "bg-blue-500 bg-opacity-20 text-blue-500"
                                  : task.status === "Pending"
                                    ? "bg-yellow-500 bg-opacity-20 text-yellow-500"
                                    : task.status === "On Hold"
                                      ? "bg-gray-500 bg-opacity-20 text-gray-500"
                                      : "bg-red-500 bg-opacity-20 text-red-500"
                              }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p>No tasks found for this project.</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Projects List View
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
                <div key={project.id} className="relative">
                  <ProjectCard
                    project={project}
                    onClick={handleProjectClick}
                  />
                  {canManageProjects && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      className="absolute top-4 right-4 bg-primary-blue hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Edit Project"
                    >
                      <FaEdit size={14} />
                    </button>
                  )}
                </div>
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
