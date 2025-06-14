import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Create an instance of the AWS SNS client using default credentials and region
const sns = new SNSClient({});

// Lambda handler to broadcast a message to all connected WebSocket clients via SNS
export const handler = async (event: any) => {
  // Extract relevant values from the event. These are expected to be passed in the event object.
  const { boardId, content, messageId } = event;

  // Publish a message to the SNS topic defined by the environment variable REALTIME_SNS_TOPIC
  // This will trigger the 'broadcastMessage' Lambda (subscribed to the topic) to send updates to WebSocket clients.
  await sns.send(new PublishCommand({
    TopicArn: process.env.REALTIME_SNS_TOPIC,  // The ARN of the SNS topic for real-time broadcasting
    Message: JSON.stringify({
      boardId: boardId,     // ID of the board to which the message belongs
      content: content,     // The actual message content
      messageId: messageId, // Unique identifier of the message
    }),
  }));

  // Return an HTTP 200 response indicating success
  return {
    statusCode: 200,
    body: "OK",
  };
};
