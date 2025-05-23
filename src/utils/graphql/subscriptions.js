import { gql } from "@apollo/client";

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

export const PROJECT_UPDATED = gql`
  subscription ProjectUpdated($id: ID!) {
    projectUpdated(id: $id) {
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
      tasks {
        id
        name
        status
      }
    }
  }
`;

export const TASK_UPDATED = gql`
  subscription TaskUpdated($id: ID!) {
    taskUpdated(id: $id) {
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
`;
