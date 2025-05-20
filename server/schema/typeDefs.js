import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
    universityId: String
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    students: [User!]!
    category: String!
    startDate: String!
    endDate: String!
    status: String!
    progress: Int!
    createdAt: String!
    updatedAt: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    projectId: ID!
    name: String!
    description: String!
    assignedStudent: User!
    status: String!
    dueDate: String!
    createdAt: String!
    updatedAt: String!
    project: Project
  }

  type ChatMessage {
    id: ID!
    sender: User!
    receiver: User!
    message: String!
    createdAt: String!
    read: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # User queries
    me: User
    users: [User!]!
    user(id: ID!): User
    students: [User!]!

    # Project queries
    projects: [Project!]!
    project(id: ID!): Project
    projectsByStudent(studentId: ID!): [Project!]!

    # Task queries
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByProject(projectId: ID!): [Task!]!
    tasksByStudent(studentId: ID!): [Task!]!

    # Chat queries
    chatMessages(userId: ID!): [ChatMessage!]!
  }

  type Mutation {
    # Auth mutations
    login(username: String!, password: String!): AuthPayload!
    signup(
      username: String!
      password: String!
      isStudent: Boolean!
      universityId: String
    ): AuthPayload!

    # Project mutations
    createProject(
      title: String!
      description: String!
      students: [ID!]!
      category: String!
      startDate: String!
      endDate: String!
      status: String!
    ): Project!

    updateProject(
      id: ID!
      title: String
      description: String
      students: [ID!]
      category: String
      startDate: String
      endDate: String
      status: String
      progress: Int
    ): Project!

    deleteProject(id: ID!): Project!

    # Task mutations
    createTask(
      projectId: ID!
      name: String!
      description: String!
      assignedStudent: ID!
      status: String!
      dueDate: String!
    ): Task!

    updateTask(
      id: ID!
      name: String
      description: String
      assignedStudent: ID
      status: String
      dueDate: String
    ): Task!

    deleteTask(id: ID!): Task!

    # Chat mutations
    sendMessage(receiverId: ID!, message: String!): ChatMessage!
    markMessageAsRead(id: ID!): ChatMessage!
  }

  type Subscription {
    messageReceived(userId: ID!): ChatMessage!
    projectUpdated(id: ID!): Project!
    taskUpdated(id: ID!): Task!
  }
`;

export default typeDefs;
