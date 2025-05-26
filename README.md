# Task Management System - Project Report

## Overview

The Task Management System is a full-stack web application designed for educational institutions to manage student projects and tasks. The system is built with React.js for the frontend, Node.js/Express for the backend, GraphQL for API communication, and MongoDB for data persistence.

## Tech-Stack

### Frontend

- **React** for frontend
- **Vite** for build tool and development server
- **Tailwind** for styling
- **Apollo Client** for GraphQL client
- **React Router DOM** for client-side routing
- **Chart.jss** for data visualization
- **React Icons** for icons

### Backend

- **Node.js** for backend
- **Express** for server framework
- **MongoDB** for database
- **GraphQL** for API communication
- **WebSocket** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

## Project Structure

### Frontend Architecture (`/src`)

```
src/
├── components/           # Reusable UI components
│   ├── Chat/            # Chat-related components
│   ├── Dashboard/       # Dashboard widgets and charts
│   ├── Layout/          # Layout components (MainLayout, etc.)
│   ├── Projects/        # Project management components
│   └── Tasks/           # Task management components
├── contexts/            # React Context providers
│   ├── AuthContext.jsx     # Authentication state management
│   ├── ChatContext.jsx     # Chat state management
│   ├── ProjectContext.jsx  # Project state management
│   ├── TaskContext.jsx     # Task state management
│   └── ThemeContext.jsx    # Theme (dark/light mode) management
├── hooks/               # Custom React hooks
├── pages/               # Main application pages
│   ├── Chat.jsx         # Real-time messaging interface
│   ├── Home.jsx         # Admin dashboard with analytics
│   ├── Projects.jsx     # Project management interface
│   ├── SignIn.jsx       # Authentication page
│   ├── SignUp.jsx       # User registration page
│   └── Tasks.jsx        # Task management interface
├── utils/               # Utility functions and configurations
│   ├── graphql/         # GraphQL operations
│   │   ├── mutations.js # GraphQL mutations
│   │   ├── queries.js   # GraphQL queries
│   │   └── subscriptions.js # GraphQL subscriptions
│   ├── apolloClient.js  # Apollo Client configuration
│   └── apiUtils.js      # API utility functions
├── App.jsx              # Main application component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

### Backend Architecture (`/server`)

```
server/
├── config/              # Configuration files
│   └── db.js           # MongoDB connection and initialization
├── middleware/          # Express middleware
│   └── context.js      # GraphQL context middleware
├── models/              # Mongoose data models
│   ├── User.js         # User model with authentication
│   ├── Project.js      # Project model
│   ├── Task.js         # Task model
│   └── ChatMessage.js  # Chat message model
├── schema/              # GraphQL schema definition
│   ├── typeDefs.js     # GraphQL type definitions
│   └── resolvers.js    # GraphQL resolvers
├── scripts/             # Database scripts
│   └── initDb.js       # Database initialization script
├── server.js            # Main server file with Apollo Server setup
└── package.json         # Backend dependencies
```

## Database Schema

The application uses MongoDB with Mongoose ODM. The database consists of four main collections:

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ["admin", "student"], default: "student"),
  universityId: String (required for students),
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**

- Password hashing with bcryptjs
- Role-based access control (admin/student)
- University ID validation for students

### Project Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  students: [ObjectId] (references User),
  category: String (enum: ["Web Development", "Mobile Development", "Data Science", "Machine Learning", "DevOps", "UX/UI Design", "Other"]),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ["In Progress", "Completed", "Pending", "On Hold", "Cancelled"]),
  progress: Number (0-100, calculated from task completion),
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**

- Many-to-many relationship with users

### Task Collection

```javascript
{
  _id: ObjectId,
  projectId: ObjectId (required, references Project),
  name: String (required),
  description: String (required),
  assignedStudent: ObjectId (required, references User),
  status: String (enum: ["In Progress", "Completed", "Pending", "On Hold", "Cancelled"]),
  dueDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**

- One-to-many relationship with projects
- One-to-one relationship with assigned student

### ChatMessage Collection

```javascript
{
  _id: ObjectId,
  sender: ObjectId (required, references User),
  receiver: ObjectId (required, references User),
  message: String (required),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**

- One-to-one messaging between users
- Indexed for efficient querying (sender, receiver, createdAt)

## GraphQL API

### Schema Overview

#### Types

- **User**: User information and authentication
- **Project**: Project management with student assignments
- **Task**: Task tracking and assignment
- **ChatMessage**: Real-time messaging
- **AuthPayload**: Authentication response with token and user

#### Queries

```graphql
type Query {
  # User queries
  me: User # Current authenticated user
  users: [User!]! # All users (admin only)
  user(id: ID!): User # Specific user
  students: [User!]! # All students
  # Project queries
  projects: [Project!]! # User's projects
  project(id: ID!): Project # Specific project
  projectsByStudent(studentId: ID!): [Project!]!

  # Task queries
  tasks: [Task!]! # User's tasks
  task(id: ID!): Task # Specific task
  tasksByProject(projectId: ID!): [Task!]!
  tasksByStudent(studentId: ID!): [Task!]!

  # Chat queries
  chatMessages(userId: ID!): [ChatMessage!]! # Messages between users
}
```

#### Mutations

```graphql
type Mutation {
  # Authentication
  login(username: String!, password: String!): AuthPayload!
  signup(username: String!, password: String!, isStudent: Boolean!, universityId: String): AuthPayload!

  # Project management
  createProject(...): Project!
  updateProject(id: ID!, ...): Project!
  deleteProject(id: ID!): Project!

  # Task management
  createTask(...): Task!
  updateTask(id: ID!, ...): Task!
  deleteTask(id: ID!): Task!

  # Chat
  sendMessage(receiverId: ID!, message: String!): ChatMessage!
  markMessageAsRead(id: ID!): ChatMessage!
}
```

#### Subscriptions

```graphql
type Subscription {
  messageReceived(userId: ID!): ChatMessage! # Real-time chat messages
  projectUpdated(id: ID!): Project! # Real-time project updates
  taskUpdated(id: ID!): Task! # Real-time task updates
}
```

### Authentication & Authorization

The system implements JWT-based authentication with role-based access control:

1. **Token Generation**: JWT tokens with 30-day expiration
2. **Context Middleware**: Extracts and validates tokens from headers
3. **Role-Based Access**:
   - **Admins**: Full CRUD access to all resources
   - **Students**: Read access to assigned projects/tasks, update own task status
4. **Protected Resolvers**: All mutations and sensitive queries require authentication

## Real-Time Chat System

### Architecture

The chat system is built using GraphQL subscriptions over WebSockets, providing real-time bidirectional communication.

#### Frontend Implementation (`/src/pages/Chat.jsx`)

- **User Selection**: Students can chat with admins, admins can chat with students
- **Real-time Messaging**: Instant message delivery using GraphQL subscriptions
- **Message History**: Persistent chat history with proper sorting
- **Read Status**: Message read/unread tracking

```javascript
// WebSocket subscription for real-time messages
const { data: subscriptionData } = useSubscription(MESSAGE_RECEIVED, {
  variables: { userId: currentUser?.id },
  onData: ({ data }) => {
    if (data?.data?.messageReceived) {
      // Refetch messages if chatting with sender
      if (
        selectedUser &&
        (data.data.messageReceived.sender.id === selectedUser.id ||
          data.data.messageReceived.receiver.id === selectedUser.id)
      ) {
        refetchMessages();
      }
    }
  },
});
```

#### Backend Implementation

```javascript
// Message subscription with filtering
messageReceived: {
  subscribe: withFilter(
    () => pubsub.asyncIterator([MESSAGE_RECEIVED]),
    (payload, variables) => {
      return String(payload.userId) === String(variables.userId);
    }
  ),
}

// Send message mutation with real-time publishing
sendMessage: async (_, { receiverId, message }, context) => {
  const user = checkAuth(context);
  const chatMessage = new ChatMessage({
    sender: user.id,
    receiver: receiverId,
    message,
    read: false,
  });

  await chatMessage.save();
  await chatMessage.populate("sender receiver");

  // Publish to subscriber
  pubsub.publish(MESSAGE_RECEIVED, {
    messageReceived: chatMessage,
    userId: receiverId,
  });

  return chatMessage;
}
```

## Real-Time Features

### WebSocket Integration

The application uses GraphQL subscriptions over WebSockets for real-time functionality:

1. **Apollo Client Configuration**:

   ```javascript
   // Split link for HTTP and WebSocket
   const splitLink = split(
     ({ query }) => {
       const definition = getMainDefinition(query);
       return (
         definition.kind === "OperationDefinition" &&
         definition.operation === "subscription"
       );
     },
     wsLink, // WebSocket for subscriptions
     authLink.concat(httpLink) // HTTP for queries/mutations
   );
   ```

2. **Server WebSocket Setup**:

   ```javascript
   // WebSocket server with GraphQL subscriptions
   const wsServer = new WebSocketServer({
     server: httpServer,
     path: "/graphql",
   });

   const serverCleanup = useServer(
     {
       schema,
       context: (ctx) => ({
         token: ctx.connectionParams?.token || "",
       }),
     },
     wsServer
   );
   ```

### Subscription Types

1. **Chat Messages**: Real-time message delivery
2. **Project Updates**: Live project status and progress updates
3. **Task Updates**: Real-time task status changes

## Development Setup

### Environment Variables

```bash
# Server (.env)
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-secret-key
PORT=5000
```

### Installation & Running

1. **Install Dependencies**:

   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   ```

2. **Start Development Servers**:

   ```bash
   # Frontend (port 5173)
   npm run dev

   # Backend (port 5000)
   cd server
   npm run dev
   ```

3. **Database Initialization**:
   The application automatically creates default users on first run:
   - Admin: username: `admin`, password: `admin123`
   - Student: username: `student`, password: `student123`, ID: `12345`
