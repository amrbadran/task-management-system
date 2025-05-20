import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { withFilter } from "graphql-subscriptions";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import ChatMessage from "../models/ChatMessage.js";
import { pubsub } from "../server.js";

// Message subscription topic
const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";
const PROJECT_UPDATED = "PROJECT_UPDATED";
const TASK_UPDATED = "TASK_UPDATED";

// Helper function to calculate project progress based on completed tasks
const calculateProjectProgress = async (projectId) => {
  try {
    const allTasks = await Task.find({ projectId });

    if (allTasks.length === 0) {
      return 0; // No tasks, so 0% progress
    }

    const completedTasks = allTasks.filter(task => task.status === "Completed");
    const progress = Math.round((completedTasks.length / allTasks.length) * 100);

    // Update the project's progress
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { progress },
      { new: true }
    );

    // Return the calculated progress
    return progress;
  } catch (error) {
    console.error("Error calculating project progress:", error);
    return 0; // Default to 0 if there's an error
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// Check if user is authenticated
// Check if user is authenticated - with better error handling
const checkAuth = (context) => {
  try {
    if (!context) {
      console.error("Context is undefined");
      throw new AuthenticationError(
        "Authentication failed: No context provided"
      );
    }

    if (!context.user) {
      console.error("No user in context", context);
      throw new AuthenticationError("Not authenticated: No user in context");
    }

    return context.user;
  } catch (error) {
    console.error("CheckAuth error:", error);
    throw new AuthenticationError("Authentication error: " + error.message);
  }
};

// Check if user is admin
const checkAdmin = (user) => {
  if (user.role !== "admin") {
    throw new ForbiddenError("Not authorized. Admin access required");
  }
  return user;
};

const resolvers = {
  Query: {
    // User queries
    me: (_, __, context) => {
      const user = checkAuth(context);
      return user;
    },

    users: async (_, __, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      return await User.find({});
    },

    user: async (_, { id }, context) => {
      const user = checkAuth(context);

      // Admin can view any user, users can only view themselves
      if (user.role !== "admin" && user.id !== id) {
        throw new ForbiddenError("Not authorized to view this user");
      }

      return await User.findById(id);
    },

    students: async (_, __, context) => {
      try {
        // This query should return both students and admins to make them visible
        // in the chat interface for selection
        const users = await User.find({});
        console.log(`Found ${users.length} users for students query`);
        return users;
      } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error("Failed to fetch users: " + error.message);
      }
    },

    // Project queries
    projects: async (_, __, context) => {
      const user = checkAuth(context);

      // Admin can view all projects, students can only view their projects
      if (user.role === "admin") {
        return await Project.find({}).populate("students");
      } else {
        return await Project.find({ students: user.id }).populate("students");
      }
    },

    project: async (_, { id }, context) => {
      const user = checkAuth(context);

      const project = await Project.findById(id).populate("students");

      if (!project) {
        throw new Error("Project not found");
      }

      // Admin can view any project, students can only view their projects
      if (
        user.role !== "admin" &&
        !project.students.some((student) => student.id === user.id)
      ) {
        throw new ForbiddenError("Not authorized to view this project");
      }

      return project;
    },

    projectsByStudent: async (_, { studentId }, context) => {
      const user = checkAuth(context);

      // Admin can view any student's projects, students can only view their own
      if (user.role !== "admin" && user.id !== studentId) {
        throw new ForbiddenError("Not authorized to view these projects");
      }

      return await Project.find({ students: studentId }).populate("students");
    },

    // Task queries
    tasks: async (_, __, context) => {
      const user = checkAuth(context);

      try {
        // Admin can view all tasks, students can only view their tasks
        if (user.role === "admin") {
          const tasks = await Task.find({})
            .populate({
              path: "assignedStudent",
              select: "id username role",
            })
            .populate({
              path: "projectId",
              populate: {
                path: "students",
                select: "id username role",
              },
            });
          return tasks;
        } else {
          const tasks = await Task.find({ assignedStudent: user.id })
            .populate({
              path: "assignedStudent",
              select: "id username role",
            })
            .populate({
              path: "projectId",
              populate: {
                path: "students",
                select: "id username role",
              },
            });
          return tasks;
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks");
      }
    },

    task: async (_, { id }, context) => {
      const user = checkAuth(context);

      const task = await Task.findById(id)
        .populate("assignedStudent")
        .populate("projectId");

      if (!task) {
        throw new Error("Task not found");
      }

      // Admin can view any task, students can only view their tasks
      if (user.role !== "admin" && task.assignedStudent.id !== user.id) {
        throw new ForbiddenError("Not authorized to view this task");
      }

      return task;
    },

    tasksByProject: async (_, { projectId }, context) => {
      const user = checkAuth(context);

      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      // Admin can view any project tasks, students can only view their project tasks
      if (user.role !== "admin" && !project.students.includes(user.id)) {
        throw new ForbiddenError("Not authorized to view these tasks");
      }

      return await Task.find({ projectId })
        .populate("assignedStudent")
        .populate("projectId");
    },

    tasksByStudent: async (_, { studentId }, context) => {
      const user = checkAuth(context);

      // Admin can view any student's tasks, students can only view their own
      if (user.role !== "admin" && user.id !== studentId) {
        throw new ForbiddenError("Not authorized to view these tasks");
      }

      return await Task.find({ assignedStudent: studentId })
        .populate("assignedStudent")
        .populate("projectId");
    },

    // Chat queries
    chatMessages: async (_, { userId }, context) => {
      try {
        const user = checkAuth(context);
        console.log(`Fetching chat messages between ${user.id} and ${userId}`);

        // Find messages between current user and specified user
        const messages = await ChatMessage.find({
          $or: [
            { sender: user.id, receiver: userId },
            { sender: userId, receiver: user.id },
          ],
        })
          .sort({ createdAt: 1 })
          .populate("sender")
          .populate("receiver");

        console.log(`Found ${messages.length} messages`);
        return messages;
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw new Error("Failed to fetch chat messages");
      }
    },
  },

  Mutation: {
    // Auth mutations
    login: async (_, { username, password }) => {
      // Validate input
      if (!username || !password) {
        throw new UserInputError("Username and password are required");
      }

      // Find user
      const user = await User.findOne({ username });

      if (!user) {
        throw new UserInputError("Invalid username or password");
      }

      // Check password
      const isPasswordValid = await user.matchPassword(password);

      if (!isPasswordValid) {
        throw new UserInputError("Invalid username or password");
      }

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    signup: async (_, { username, password, isStudent, universityId }) => {
      // Validate input
      if (!username || !password) {
        throw new UserInputError("Username and password are required");
      }

      if (isStudent && !universityId) {
        throw new UserInputError("University ID is required for students");
      }

      // Check if username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        throw new UserInputError("Username already exists");
      }

      // Create user
      const user = await User.create({
        username,
        password,
        role: isStudent ? "student" : "admin",
        universityId: isStudent ? universityId : null,
      });

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    // Project mutations
    createProject: async (_, args, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      // Validate input
      if (
        !args.title ||
        !args.description ||
        !args.category ||
        !args.startDate ||
        !args.endDate
      ) {
        throw new UserInputError("All fields are required");
      }

      if (new Date(args.endDate) < new Date(args.startDate)) {
        throw new UserInputError("End date must be after start date");
      }

      // Create project
      const project = await Project.create({
        ...args,
        progress: 0,
      });

      // Populate students
      await project.populate("students");

      // Publish project updated event
      pubsub.publish(PROJECT_UPDATED, { projectUpdated: project });

      return project;
    },

    updateProject: async (_, { id, ...args }, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        throw new Error("Project not found");
      }

      // Update project
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { ...args },
        { new: true }
      );

      // Populate students
      await updatedProject.populate("students");

      // Publish project updated event
      pubsub.publish(PROJECT_UPDATED, { projectUpdated: updatedProject });

      return updatedProject;
    },

    // Fix for project delete mutation
    deleteProject: async (_, { id }, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        throw new Error("Project not found");
      }

      // Delete associated tasks
      await Task.deleteMany({ projectId: id });

      // Delete project - using deleteOne instead of remove
      await Project.deleteOne({ _id: id });

      return project;
    },

    // Task mutations
    createTask: async (_, args, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      // Validate input
      if (
        !args.name ||
        !args.description ||
        !args.assignedStudent ||
        !args.dueDate
      ) {
        throw new UserInputError("All fields are required");
      }

      // Find project
      const project = await Project.findById(args.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      // Find assigned student
      const student = await User.findById(args.assignedStudent);

      if (!student) {
        throw new Error("Student not found");
      }

      if (student.role !== "student") {
        throw new UserInputError("Only students can be assigned to tasks");
      }

      // Create task
      const task = await Task.create({
        ...args,
      });

      // Populate references
      await task.populate("assignedStudent");
      await task.populate("projectId");

      // Update project progress
      const projectId = args.projectId;
      const progress = await calculateProjectProgress(projectId);

      // Get the updated project to publish event
      const updatedProject = await Project.findById(projectId).populate("students");

      // Publish project updated event
      pubsub.publish(PROJECT_UPDATED, { projectUpdated: updatedProject });

      // Publish task updated event
      pubsub.publish(TASK_UPDATED, { taskUpdated: task });

      return task;
    },

    updateTask: async (_, { id, ...args }, context) => {
      const user = checkAuth(context);

      // Find task
      const task = await Task.findById(id);

      if (!task) {
        throw new Error("Task not found");
      }

      // Admin can update any task, students can only update their own status
      if (user.role !== "admin") {
        if (task.assignedStudent.toString() !== user.id) {
          throw new ForbiddenError("Not authorized to update this task");
        }

        // Students can only update status
        const allowedUpdates = ["status"];
        const requestedUpdates = Object.keys(args);

        const isAllowed = requestedUpdates.every((update) =>
          allowedUpdates.includes(update)
        );

        if (!isAllowed) {
          throw new ForbiddenError("Students can only update task status");
        }
      }

      // Update task
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { ...args },
        { new: true }
      );

      // Populate references
      await updatedTask.populate("assignedStudent");
      await updatedTask.populate("projectId");

      // Update project progress if task status is updated
      if (args.status) {
        const projectId = task.projectId;
        const progress = await calculateProjectProgress(projectId);

        // Get the updated project to publish event
        const updatedProject = await Project.findById(projectId).populate("students");

        // Publish project updated event
        pubsub.publish(PROJECT_UPDATED, { projectUpdated: updatedProject });
      }

      // Publish task updated event
      pubsub.publish(TASK_UPDATED, { taskUpdated: updatedTask });

      return updatedTask;
    },

    // Fix for task delete mutation
    deleteTask: async (_, { id }, context) => {
      const user = checkAuth(context);
      checkAdmin(user);

      // Find task
      const task = await Task.findById(id);

      if (!task) {
        throw new Error("Task not found");
      }

      // Store projectId before deletion
      const projectId = task.projectId;

      // Delete task - using deleteOne instead of remove
      await Task.deleteOne({ _id: id });

      // Update project progress using helper function
      const progress = await calculateProjectProgress(projectId);

      // Get the updated project to publish event
      const updatedProject = await Project.findById(projectId).populate("students");

      // Publish project updated event
      pubsub.publish(PROJECT_UPDATED, { projectUpdated: updatedProject });

      return task;
    },

    // Chat mutations
    sendMessage: async (_, { receiverId, message }, context) => {
      try {
        const user = checkAuth(context);
        console.log(
          `User ${user.id} is sending message to ${receiverId}: "${message}"`
        );

        // Find receiver
        const receiver = await User.findById(receiverId);

        if (!receiver) {
          throw new Error("Receiver not found");
        }

        // Create message
        const chatMessage = new ChatMessage({
          sender: user.id,
          receiver: receiverId,
          message,
          read: false,
        });

        // Save to database
        await chatMessage.save();
        console.log(`Saved message with ID: ${chatMessage.id}`);

        // Populate sender and receiver
        await chatMessage.populate("sender");
        await chatMessage.populate("receiver");

        // Publish message received event
        console.log(`Publishing message to ${receiverId}`);
        pubsub.publish(MESSAGE_RECEIVED, {
          messageReceived: chatMessage,
          userId: receiverId,
        });

        return chatMessage;
      } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message: " + error.message);
      }
    },

    markMessageAsRead: async (_, { id }, context) => {
      try {
        const user = checkAuth(context);
        console.log(`User ${user.id} is marking message ${id} as read`);

        // Find message
        const message = await ChatMessage.findById(id);

        if (!message) {
          throw new Error("Message not found");
        }

        // Check if user is the receiver
        if (message.receiver.toString() !== user.id) {
          throw new ForbiddenError(
            "Not authorized to mark this message as read"
          );
        }

        // Mark message as read
        message.read = true;
        await message.save();
        console.log(`Message ${id} marked as read`);

        // Populate sender and receiver
        await message.populate("sender");
        await message.populate("receiver");

        return message;
      } catch (error) {
        console.error("Error marking message as read:", error);
        throw new Error("Failed to mark message as read: " + error.message);
      }
    },
  },

  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_RECEIVED]),
        (payload, variables) => {
          console.log(
            `Checking subscription: payload userId=${payload.userId}, variables userId=${variables.userId}`
          );
          return String(payload.userId) === String(variables.userId);
        }
      ),
    },

    projectUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([PROJECT_UPDATED]),
        (payload, variables) => {
          return payload.projectUpdated.id === variables.id;
        }
      ),
    },

    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        (payload, variables) => {
          return payload.taskUpdated.id === variables.id;
        }
      ),
    },
  },

  Project: {
    tasks: async (parent) => {
      return await Task.find({ projectId: parent.id })
        .populate("assignedStudent")
        .populate("projectId");
    },
  },

  Task: {
    project: async (parent) => {
      return await Project.findById(parent.projectId).populate("students");
    },
  },
};

export default resolvers;