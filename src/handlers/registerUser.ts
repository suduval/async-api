import { APIGatewayProxyHandler } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";

// Create an SNS client instance (uses default AWS credentials and region)
const sns = new SNSClient({});

// Get the SNS Topic ARN from environment variable for publishing user creation messages
const topicArn = process.env.USER_CREATED_TOPIC!;

// Lambda handler triggered by HTTP POST /users/register
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse the request body
    const body = JSON.parse(event.body || "{}");
    const { name, email } = body;

    // Validate input: both name and email are required
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name and email are required." }),
      };
    }

    // Create a payload object with a generated requestId, name, and email
    const payload = {
      requestId: uuidv4(),  // Unique identifier for traceability
      name,
      email,
    };

    // Publish the user registration payload to the SNS topic
    await sns.send(
      new PublishCommand({
        TopicArn: topicArn,                      // SNS topic to trigger further processing
        Message: JSON.stringify(payload),       // Payload to be processed by downstream Lambda
      })
    );

    // Respond with HTTP 202 (Accepted) to indicate asynchronous processing
    return {
      statusCode: 202,
      body: JSON.stringify({
        message: "User registration in progress.",
        requestId: payload.requestId,
      }),
    };
  } catch (error) {
    // Log and handle any unexpected errors
    console.error("Registration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};