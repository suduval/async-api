// A simple AWS Lambda handler that returns a 200 OK response
export const handler = async () => {
  // Return a standard HTTP 200 response with a plain text body
  return {
    statusCode: 200,  // HTTP success code
    body: "OK",       // Response content
  };
};
