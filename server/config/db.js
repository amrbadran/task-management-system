import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    const { default: User } = await import("../models/User.js");
    const { default: Project } = await import("../models/Project.js");
    const { default: Task } = await import("../models/Task.js");

    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0) {
      console.log("No admin user found. Creating default admin user...");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      const admin = await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Default admin user created");

      const userCount = await User.countDocuments();

      if (userCount === 1) {
        console.log("Creating demo student user...");

        const studentPassword = await bcrypt.hash("student123", salt);

        const student = await User.create({
          username: "student",
          password: studentPassword,
          role: "student",
          universityId: "12345",
        });

        console.log("Demo student user created");

        if ((await Project.countDocuments()) === 0) {
          console.log("Creating demo projects and tasks...");

          const project = await Project.create({
            title: "Web Development Project",
            description:
              "Build a task management system for students and administrators",
            students: [student._id],
            category: "Web Development",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "In Progress",
            progress: 50,
          });

          await Task.create({
            projectId: project._id,
            name: "Frontend Implementation",
            description: "Implement the frontend using React and Tailwind CSS",
            assignedStudent: student._id,
            status: "In Progress",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          });

          console.log("Demo projects and tasks created");
        }
      }
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
