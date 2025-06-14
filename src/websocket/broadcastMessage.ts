import {
  DynamoDBClient,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

const dynamoClient = new DynamoDBClient({});

/**
 * This Lambda is triggered by an SNS message (via subscription).
 * It broadcasts the message to all active WebSocket connections stored in DynamoDB.
 */
export const handler = async (event: any) => {
  // Retrieve SNS message body
  const messageBody = event.Records?.[0]?.Sns?.Message;

  if (!messageBody) {
    return { statusCode: 400, body: 'No message to broadcast' };
  }

  const message = JSON.parse(messageBody); // Deserialize the actual message payload

  // Fetch all active WebSocket connection IDs from the DynamoDB table
  const scanResult = await dynamoClient.send(
    new ScanCommand({ TableName: process.env.CONNECTIONS_TABLE })
  );

  const connections = scanResult.Items || [];

  // Initialize API Gateway Management client to post messages to WebSocket clients
  const apigwClient = new ApiGatewayManagementApiClient({
    endpoint: process.env.WEBSOCKET_API_ENDPOINT, // Required for posting to WebSocket connections
  });

  // Iterate through all connections and send the message
  const promises = connections.map((item) => {
    const command = new PostToConnectionCommand({
      ConnectionId: item.connectionId.S, // Extract raw connection ID from DynamoDB item
      Data: JSON.stringify(message),     // Send the message data as stringified JSON
    });

    // Handle potential disconnections silently
    return apigwClient.send(command).catch((err) => {
      console.warn(`Failed to send to ${item.connectionId.S}`, err);
    });
  });

  // Wait for all send operations to complete
  await Promise.all(promises);

  return {
    statusCode: 200,
    body: 'Message sent to all connections.',
  };
};
