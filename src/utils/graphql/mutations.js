import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
        universityId
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup(
    $username: String!
    $password: String!
    $isStudent: Boolean!
    $universityId: String
  ) {
    signup(
      username: $username
      password: $password
      isStudent: $isStudent
      universityId: $universityId
    ) {
      token
      user {
        id
        username
        role
        universityId
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $description: String!
    $students: [ID!]!
    $category: String!
    $startDate: String!
    $endDate: String!
    $status: String!
  ) {
    createProject(
      title: $title
      description: $description
      students: $students
      category: $category
      startDate: $startDate
      endDate: $endDate
      status: $status
    ) {
      id
      title
      description
      students {
        id
        username
      }
      category
      startDate
      endDate
      status
      progress
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $title: String
    $description: String
    $students: [ID!]
    $category: String
    $startDate: String
    $endDate: String
    $status: String
    $progress: Int
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      students: $students
      category: $category
      startDate: $startDate
      endDate: $endDate
      status: $status
      progress: $progress
    ) {
      id
      title
      description
      students {
        id
        username
      }
      category
      startDate
      endDate
      status
      progress
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      title
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $name: String!
    $description: String!
    $assignedStudent: ID!
    $status: String!
    $dueDate: String!
  ) {
    createTask(
      projectId: $projectId
      name: $name
      description: $description
      assignedStudent: $assignedStudent
      status: $status
      dueDate: $dueDate
    ) {
      id
      projectId
      name
      description
      assignedStudent {
        id
        username
      }
      status
      dueDate
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $name: String
    $description: String
    $assignedStudent: ID
    $status: String
    $dueDate: String
  ) {
    updateTask(
      id: $id
      name: $name
      description: $description
      assignedStudent: $assignedStudent
      status: $status
      dueDate: $dueDate
    ) {
      id
      projectId
      name
      description
      assignedStudent {
        id
        username
      }
      status
      dueDate
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      name
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $message: String!) {
    sendMessage(receiverId: $receiverId, message: $message) {
      id
      sender {
        id
        username
      }
      receiver {
        id
        username
      }
      message
      createdAt
      read
    }
  }
`;

export const MARK_MESSAGE_AS_READ = gql`
  mutation MarkMessageAsRead($id: ID!) {
    markMessageAsRead(id: $id) {
      id
      read
    }
  }
`;
