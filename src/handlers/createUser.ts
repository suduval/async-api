// Import AWS Lambda SNS handler type and UUID generator
import { SNSHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

// Import utility to interact with DynamoDB and the User type definition
import { putItem } from "../utils/dynamo";
import { User } from "../utils/types";

// Get the name of the DynamoDB table from environment variables
const USERS_TABLE = process.env.USERS_TABLE!;

// Lambda handler triggered by an SNS topic publishing user data
export const handler: SNSHandler = async (event) => {
  // Iterate through each SNS record in the event
  for (const record of event.Records) {
    try {
      // Parse the SNS message payload (assumed to be JSON containing name and email)
      const message = JSON.parse(record.Sns.Message);

      // Construct a new User object with a generated UUID
      const newUser: User = {
        userId: uuidv4(),
        name: message.name,
        email: message.email,
      };

      // Store the new user in the DynamoDB table
      await putItem(USERS_TABLE, newUser);

      // Log success
      console.log(`User created: ${newUser.userId}`);
    } catch (err) {
      // Handle and log any errors encountered during processing
      console.error("Failed to create user:", err);
    }
  }
};
