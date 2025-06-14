// A simple AWS Lambda handler that returns a 200 OK response
export const handler = async () => {
  return { statusCode: 200, body: "OK" };
};
