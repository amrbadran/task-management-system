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
          <div>
            {projectLoading ? (
              <div className="flex items-center justify-center h-40">
                <p className={darkMode ? "text-white" : "text-gray-800"}>
                  Loading project details...
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold text-primary-blue">
                    {selectedProject.title}
                  </h1>
                  <div className="flex space-x-2">
                    {canManageProjects && (
                      <button
                        onClick={() => handleEditProject(selectedProject)}
                        className="px-4 py-2 bg-primary-blue hover:bg-blue-700 text-white rounded transition-colors duration-300 flex items-center"
                      >
                        <FaEdit className="mr-2" /> Edit Project
                      </button>
                    )}
                    <button
                      onClick={handleBackToProjects}
                      className="px-4 py-2 bg-primary-green hover:bg-green-700 text-white rounded transition-colors duration-300"
                    >
                      Back to Projects
                    </button>
                  </div>
                </div>

                <div
                  className={`${darkMode ? "bg-dark-card" : "bg-white"
                    } p-6 rounded-lg shadow-md mb-8 transition-colors duration-300`}
                >
                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Description:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Category:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {selectedProject.category}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Students:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {selectedProject.students
                        .map((student) =>
                          typeof student === "string"
                            ? student
                            : student.username
                        )
                        .join(", ")}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Status:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {selectedProject.status}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Progress:
                    </p>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-sm mb-1">
                      <div
                        className="h-full bg-primary-blue rounded-sm"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Based on completed tasks
                      </p>
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {selectedProject.progress}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      Start Date:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {formatDate(selectedProject.startDate)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      End Date:
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {formatDate(selectedProject.endDate)}
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-primary-blue mb-4">
                  Tasks
                </h2>

                {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                  <div>
                    {selectedProject.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`${darkMode ? "bg-dark-card" : "bg-white"
                          } p-4 rounded-lg shadow-md mb-4 transition-colors duration-300`}
                      >
                        <div
                          className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {task.name}
                        </div>
                        <div
                          className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          {task.description}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Assigned to:{" "}
                            {task.assignedStudent.username ||
                              task.assignedStudent}
                          </span>
                          <span
                            className={`
                            ${task.status === "Completed"
                                ? "text-green-600"
                                : ""
                              }
                            ${task.status === "In Progress"
                                ? "text-blue-600"
                                : ""
                              }
                            ${task.status === "Pending" ? "text-yellow-600" : ""
                              }
                            ${task.status === "On Hold" ? "text-gray-600" : ""}
                            ${task.status === "Cancelled" ? "text-red-600" : ""}
                          `}
                          >
                            Status: {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    No tasks found for this project.
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          // Projects List View
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary-blue mb-4 md:mb-0">
                Projects Overview
              </h2>
              {canManageProjects && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary-blue hover:bg-blue-700 text-white rounded transition-colors duration-300"
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
                      className="absolute top-2 right-2 bg-primary-blue hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-300"
                      title="Edit Project"
                    >
                      <FaEdit />
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
