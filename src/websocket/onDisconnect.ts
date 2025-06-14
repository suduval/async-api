import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

// Create a DynamoDB client to interact with the WebSocketConnections table
const client = new DynamoDBClient({});

/**
 * This Lambda function handles WebSocket disconnection events.
 * It removes the client's connectionId from the DynamoDB table when they disconnect.
 */
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  // Extract the WebSocket connection ID from the request context
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    // If no connectionId is present, return a 400 error
    return { statusCode: 400, body: 'Missing connectionId' };
  }

  // Prepare a DeleteItemCommand to remove the connectionId from DynamoDB
  const command = new DeleteItemCommand({
    TableName: process.env.CONNECTIONS_TABLE, // Table name from environment variable
    Key: {
      connectionId: { S: connectionId }, // The partition key to identify the item
    },
  });

  // Send the command to delete the connection from DynamoDB
  await client.send(command);

  // Return success response
  return {
    statusCode: 200,
    body: 'Disconnected.',
  };
};
