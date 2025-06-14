// Import API Gateway handler type and DynamoDB utility function
import { APIGatewayProxyHandler } from "aws-lambda";
import { getItem } from "../utils/dynamo";
import { User } from "../utils/types";

// Retrieve the table name for users from environment variables
const USERS_TABLE = process.env.USERS_TABLE!;

// Lambda handler to fetch a user by email using API Gateway
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract the 'email' query string parameter from the incoming HTTP request
    const email = event.queryStringParameters?.email;

    // Validate the input: return a 400 error if no email is provided
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email query parameter is required" }),
      };
    }

    // Attempt to retrieve the user from the DynamoDB table
    const user = (await getItem(USERS_TABLE, { email })) as User;

    // If no user is found, return a 404 Not Found response
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // If user is found, return the user data with a 200 OK status
    return {
      statusCode: 200,
      body: JSON.stringify({
        userId: user.userId,
        name: user.name,
        email: user.email,
      }),
    };
  } catch (error) {
    // Log any unexpected errors and return a 500 Internal Server Error response
    console.error("Error fetching user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};