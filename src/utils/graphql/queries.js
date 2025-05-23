import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      role
      universityId
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
      universityId
      createdAt
      updatedAt
    }
  }
`;

export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      username
      role
      universityId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
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
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
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
      createdAt
      updatedAt
      tasks {
        id
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
  }
`;

export const GET_PROJECTS_BY_STUDENT = gql`
  query GetProjectsByStudent($studentId: ID!) {
    projectsByStudent(studentId: $studentId) {
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
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      projectId
      name
      description
      assignedStudent {
        id
        username
        role
      }
      status
      dueDate
      createdAt
      updatedAt
      project {
        id
        title
        description
        status
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
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
      createdAt
      updatedAt
      project {
        id
        title
        description
        category
        status
      }
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject($projectId: ID!) {
    tasksByProject(projectId: $projectId) {
      id
      name
      description
      assignedStudent {
        id
        username
      }
      status
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS_BY_STUDENT = gql`
  query GetTasksByStudent($studentId: ID!) {
    tasksByStudent(studentId: $studentId) {
      id
      projectId
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      project {
        id
        title
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($userId: ID!) {
    chatMessages(userId: $userId) {
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

export const MESSAGE_RECEIVED = gql`
  subscription MessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
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
