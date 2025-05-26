import dotenv from "dotenv";
import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import ChatMessage from "../models/ChatMessage.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const createSampleData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already has data. Skipping initialization.");
      return;
    }

    console.log("Creating sample data...");

    const adminPassword = await hashPassword("admin123");
    const admin = await User.create({
      username: "admin",
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user created");

    const studentPassword = await hashPassword("student123");
    const student1 = await User.create({
      username: "student1",
      password: studentPassword,
      role: "student",
      universityId: "12345",
    });

    const student2 = await User.create({
      username: "student2",
      password: studentPassword,
      role: "student",
      universityId: "67890",
    });

    const student3 = await User.create({
      username: "student3",
      password: studentPassword,
      role: "student",
      universityId: "54321",
    });

    console.log("Student users created");

    const project1 = await Project.create({
      title: "Website Redesign",
      description:
        "Redesign the company website to improve user experience and mobile responsiveness.",
      students: [student1._id, student2._id],
      category: "Web Development",
      startDate: new Date("2025-01-15"),
      endDate: new Date("2025-03-15"),
      status: "In Progress",
      progress: 40,
    });

    const project2 = await Project.create({
      title: "Mobile App Development",
      description:
        "Develop a cross-platform mobile application for customer engagement.",
      students: [student2._id, student3._id],
      category: "Mobile Development",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-04-30"),
      status: "Pending",
      progress: 0,
    });

    console.log("Projects created");

    await Task.create({
      projectId: project1._id,
      name: "Design Homepage",
      description:
        "Create a responsive design for the homepage with modern aesthetics.",
      assignedStudent: student1._id,
      status: "In Progress",
      dueDate: new Date("2025-02-15"),
    });

    await Task.create({
      projectId: project1._id,
      name: "Implement Authentication",
      description:
        "Set up user authentication system with JWT and role-based access control.",
      assignedStudent: student2._id,
      status: "Pending",
      dueDate: new Date("2025-02-28"),
    });

    await Task.create({
      projectId: project2._id,
      name: "UI/UX Design",
      description:
        "Design user interface and experience for the mobile application.",
      assignedStudent: student2._id,
      status: "Pending",
      dueDate: new Date("2025-02-20"),
    });

    await Task.create({
      projectId: project2._id,
      name: "API Integration",
      description: "Implement API integration with backend services.",
      assignedStudent: student3._id,
      status: "Pending",
      dueDate: new Date("2025-03-15"),
    });

    console.log("Tasks created");

    await ChatMessage.create({
      sender: admin._id,
      receiver: student1._id,
      message: "Hello! How is the homepage design coming along?",
      read: false,
    });

    await ChatMessage.create({
      sender: student1._id,
      receiver: admin._id,
      message: "It's going well! I'll have a draft ready by tomorrow.",
      read: true,
    });

    console.log("Chat messages created");

    console.log("Sample data created successfully");
  } catch (error) {
    console.error(`Error creating sample data: ${error.message}`);
  }
};

const initDb = async () => {
  await connectDB();
  await createSampleData();
  mongoose.disconnect();
  console.log("Database initialization complete");
};

initDb();
