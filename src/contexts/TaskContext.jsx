import { createContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../utils/graphql/queries";
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from "../utils/graphql/mutations";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Process tasks with date validation
  const processTasks = useCallback((tasksData) => {
    return tasksData.map(task => {
      // Create a copy of the task to avoid modifying the original data
      const processedTask = { ...task };

      // Validate dueDate format
      try {
        // Check if dueDate exists
        if (task.dueDate) {
          // Parse the date - handles both ISO strings and timestamps
          const date = new Date(task.dueDate);

          // Check if the date is valid
          if (isNaN(date.getTime())) {
            console.warn(`Truly invalid date detected for task ${task.id}: ${task.dueDate}`);
          }
        }
      } catch (err) {
        console.error(`Error processing date for task ${task.id}:`, err);
      }

      return processedTask;
    });
  }, []);

  // Query tasks
  const { loading, data, error, refetch } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only", // Don't use cache for tasks
    pollInterval: 2000, // Poll every 2 seconds for updates
    onCompleted: (data) => {
      if (data && data.tasks) {
        const processedTasks = processTasks(data.tasks);
        setTasks(processedTasks);
      }
    },
    onError: (error) => {
      console.error("Error loading tasks:", error);
    },
  });

  // Mutations
  const [createTaskMutation] = useMutation(CREATE_TASK, {
    onCompleted: (data) => {
      // Immediately update local state for responsiveness
      if (data && data.createTask) {
        const newTask = data.createTask;
        setTasks(prevTasks => {
          const processed = processTasks([newTask]);
          return [...prevTasks, ...processed];
        });
      }
      refetch(); // Also refetch to ensure consistency with server
    },
  });

  const [updateTaskMutation] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      // Immediately update local state for responsiveness
      if (data && data.updateTask) {
        const updatedTask = data.updateTask;
        setTasks(prevTasks => {
          return prevTasks.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          );
        });
      }
      refetch(); // Also refetch to ensure consistency with server
    },
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: (data) => {
      // Immediately update local state for responsiveness
      if (data && data.deleteTask) {
        const deletedTask = data.deleteTask;
        setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedTask.id));
      }
      refetch(); // Also refetch to ensure consistency with server
    },
  });

  const addTask = async (taskData) => {
    try {
      const { data } = await createTaskMutation({
        variables: {
          projectId: taskData.projectId,
          name: taskData.name,
          description: taskData.description,
          assignedStudent: taskData.assignedStudent,
          status: taskData.status,
          dueDate: taskData.dueDate,
        },
      });

      return data.createTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error(error.message || "Failed to create task");
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const { data } = await updateTaskMutation({
        variables: {
          id,
          ...updatedData,
        },
      });

      return data.updateTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error(error.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { id },
      });

      return data.deleteTask;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error(error.message || "Failed to delete task");
    }
  };

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };

  const getTasksByProject = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const refreshTasks = () => {
    refetch();
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByProject,
    refreshTasks,
    loading,
    error,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
