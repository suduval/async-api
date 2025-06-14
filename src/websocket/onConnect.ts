import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

/**
 * This Lambda function is triggered when a WebSocket client connects.
 * It stores the client's connectionId in the WebSocketConnections DynamoDB table.
 */
export const handler = async (event: APIGatewayEvent) => {
  // Extract the unique connection ID from the WebSocket event
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    console.error('Missing connectionId');
    return { statusCode: 400, body: 'Missing connectionId' };
  }

  // Construct DynamoDB PutItemCommand to store the connection ID
  const command = new PutItemCommand({
    TableName: process.env.CONNECTIONS_TABLE!, // DynamoDB table name from env
    Item: {
      connectionId: { S: connectionId },       // Save the connectionId as the partition key
    },
  });

  try {
    // Execute the command to persist the connection ID
    await client.send(command);
    return { statusCode: 200, body: 'Connected.' };
  } catch (err) {
    console.error('Failed to store connection ID:', err);
    return { statusCode: 500, body: 'Failed to store connection ID' };
  }
};