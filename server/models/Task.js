import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Project ID is required"],
    },
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    assignedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned student is required"],
    },
    status: {
      type: String,
      required: [true, "Task status is required"],
      enum: ["In Progress", "Completed", "Pending", "On Hold", "Cancelled"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
