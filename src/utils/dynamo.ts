// Import base DynamoDB client and commands from AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// Create the low-level DynamoDB client
const client = new DynamoDBClient({});

// Create a high-level DocumentClient for easier interaction with JSON-like objects
export const ddb = DynamoDBDocumentClient.from(client);

/**
 * putItem: Writes a single item to a DynamoDB table.
 * @param tableName - Name of the DynamoDB table
 * @param item - JavaScript object representing the item to be inserted
 */
export const putItem = async (tableName: string, item: Record<string, any>) => {
  await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );
};

/**
 * getItem: Fetches a single item from DynamoDB using its primary key.
 * @param tableName - Name of the DynamoDB table
 * @param key - Object with key attributes (e.g., { email: "user@example.com" })
 * @returns The item if found, otherwise undefined
 */
export const getItem = async (
  tableName: string,
  key: Record<string, any>
) => {
  const result = await ddb.send(
    new GetCommand({
      TableName: tableName,
      Key: key,
    })
  );
  return result.Item;
};

/**
 * scanItems: Retrieves all items from the specified DynamoDB table.
 * NOTE: Scan is inefficient for large datasets and used mainly for admin/list views.
 * @param tableName - Name of the DynamoDB table
 * @returns Array of all items found in the table
 */
export const scanItems = async (tableName: string) => {
  const result = await ddb.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return result.Items || [];
};