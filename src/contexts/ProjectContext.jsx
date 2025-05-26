import { createContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECTS } from "../utils/graphql/queries";
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "../utils/graphql/mutations";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  const processProjects = useCallback((projectsData) => {
    return projectsData.map((project) => {
      const processedProject = { ...project };

      try {
        if (project.startDate) {
          const date = new Date(project.startDate);
          if (isNaN(date.getTime())) {
            console.warn(
              `Invalid startDate detected for project ${project.id}: ${project.startDate}`
            );
          }
        }

        if (project.endDate) {
          const date = new Date(project.endDate);
          if (isNaN(date.getTime())) {
            console.warn(
              `Invalid endDate detected for project ${project.id}: ${project.endDate}`
            );
          }
        }
      } catch (err) {
        console.error(`Error processing dates for project ${project.id}:`, err);
      }

      return processedProject;
    });
  }, []);

  const { loading, data, error, refetch } = useQuery(GET_PROJECTS, {
    fetchPolicy: "network-only",
    pollInterval: 2000,
    onCompleted: (data) => {
      if (data && data.projects) {
        const processedProjects = processProjects(data.projects);
        setProjects(processedProjects);
      }
    },
    onError: (error) => {
      console.error("Error loading projects:", error);
    },
  });

  const [createProjectMutation] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      if (data && data.createProject) {
        const newProject = data.createProject;
        setProjects((prevProjects) => {
          const processed = processProjects([newProject]);
          return [...prevProjects, ...processed];
        });
      }
      refetch();
    },
  });

  const [updateProjectMutation] = useMutation(UPDATE_PROJECT, {
    onCompleted: (data) => {
      if (data && data.updateProject) {
        const updatedProject = data.updateProject;
        setProjects((prevProjects) => {
          return prevProjects.map((project) =>
            project.id === updatedProject.id
              ? { ...project, ...updatedProject }
              : project
          );
        });
      }
      refetch();
    },
  });

  const [deleteProjectMutation] = useMutation(DELETE_PROJECT, {
    onCompleted: (data) => {
      if (data && data.deleteProject) {
        const deletedProject = data.deleteProject;
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== deletedProject.id)
        );
      }
      refetch();
    },
  });

  const addProject = async (projectData) => {
    try {
      const { data } = await createProjectMutation({
        variables: {
          title: projectData.title,
          description: projectData.description,
          students: projectData.students,
          category: projectData.category,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          status: projectData.status,
        },
      });

      return data.createProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error(error.message || "Failed to create project");
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      const { data } = await updateProjectMutation({
        variables: {
          id,
          ...updatedData,
        },
      });

      return data.updateProject;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error(error.message || "Failed to update project");
    }
  };

  const deleteProject = async (id) => {
    try {
      const { data } = await deleteProjectMutation({
        variables: { id },
      });

      return data.deleteProject;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error(error.message || "Failed to delete project");
    }
  };

  const getProjectById = (id) => {
    return projects.find((project) => project.id === id);
  };

  const refreshProjects = () => {
    refetch();
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    refreshProjects,
    loading,
    error,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
