/**
 * User: Represents a registered user in the system.
 */
export interface User {
  userId: string;     // Unique identifier for the user (UUID)
  name: string;       // User's display name
  email: string;      // User's email address (used as primary key in DynamoDB)
}

/**
 * MessageBoard: Represents a discussion or topic board.
 */
export interface MessageBoard {
  boardId: string;    // Unique identifier for the board (UUID)
  name: string;       // Name/title of the board
  createdBy: string;  // userId of the creator
  createdAt: string;  // ISO 8601 timestamp of when the board was created
}

/**
 * Message: Represents an individual message posted on a board.
 */
export interface Message {
  messageId: string;  // Unique identifier for the message (UUID)
  boardId: string;    // ID of the board the message belongs to
  userId: string;     // ID of the user who posted the message
  content: string;    // Actual message content/text
  postedAt: string;   // ISO 8601 timestamp of when the message was posted
}