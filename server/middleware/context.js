import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const context = async ({ req }) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : "";

    if (!token) {
      console.log("No token provided");
      return { user: null };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("User not found");
        return { user: null };
      }

      return { user };
    } catch (error) {
      console.error("Authentication error:", error.message);
      return { user: null };
    }
  } catch (error) {
    console.error("Context middleware error:", error);
    return { user: null };
  }
};
