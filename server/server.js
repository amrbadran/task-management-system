import dotenv from "dotenv";
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";

// Import GraphQL type definitions and resolvers
import typeDefs from "./schema/typeDefs.js";
import resolvers from "./schema/resolvers.js";

// Import database connection
import connectDB from "./config/db.js";

// Import context middleware
import { context } from "./middleware/context.js";

// Load environment variables
dotenv.config();

// Create a new PubSub instance for subscriptions
export const pubsub = new PubSub();

// Start the server
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create Express app and HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // Enable CORS with specific options
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"], // Allow your frontend origins
      credentials: true, // Allow cookies if you're using them
    })
  );

  // Create GraphQL schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Set up WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Set up WebSocket subscription server
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx) => {
        // Extract token from connection params if available
        const token = ctx.connectionParams?.token || "";
        return { token };
      },
    },
    wsServer
  );

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    // Allow introspection for development
    introspection: true,
    // Allow playground in development
    playground: true,
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo Server middleware to Express
  server.applyMiddleware({
    app,
    cors: false, // We've already configured CORS above
  });

  // Set the port from environment variables or default to 5000
  const PORT = process.env.PORT || 5000;

  // Start the server
  httpServer.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `WebSocket server running on ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

// Handle any errors during startup
startServer().catch((error) => {
  console.error("Error starting server:", error);
});
