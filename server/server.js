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

import typeDefs from "./schema/typeDefs.js";
import resolvers from "./schema/resolvers.js";

import connectDB from "./config/db.js";

import { context } from "./middleware/context.js";

dotenv.config();

export const pubsub = new PubSub();

const startServer = async () => {
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    })
  );

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: (ctx) => {
        const token = ctx.connectionParams?.token || "";
        return { token };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

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

    introspection: true,
    playground: true,
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false,
  });

  const PORT = process.env.PORT || 5000;

  httpServer.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `WebSocket server running on ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
