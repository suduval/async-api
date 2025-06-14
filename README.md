# Async API Message Board with Real-Time WebSocket Updates

This is a Serverless-based message board application built with TypeScript, AWS Lambda, DynamoDB, SNS, SQS, and WebSockets. It allows users to register, post messages to discussion boards, and receive real-time updates via WebSocket.

---

## Features

- User registration and board creation.
- Posting messages to discussion boards.
- Data persistence using DynamoDB.
- Event-driven architecture using SNS and SQS.
- Real-time notifications via WebSocket (AWS API Gateway WebSocket + SNS).
- Manual SNS subscription setup for Lambda triggers (avoiding stack conflicts).

---

## Architecture

- **API Gateway (HTTP)** — handles REST endpoints.
- **Lambda Functions** — backend logic in TypeScript.
- **DynamoDB** — stores users, boards, messages, and WebSocket connections.
- **SNS Topics** — event messaging (user created, message posted).
- **SQS Queue** — async board creation.
- **API Gateway (WebSocket)** — for real-time broadcasting.
- **Lambda Subscriptions** — trigger broadcast on SNS topic.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Deploy to AWS

Ensure your AWS CLI is configured.

```bash
npx serverless deploy
```

### 3. WebSocket Test Tool

Install:

```bash
npm install -g wscat
```

Connect:

```bash
wscat -c wss://<your-ws-id>.execute-api.ap-southeast-2.amazonaws.com/dev
```

---

## API Endpoints

| Method | Path                          | Description                    |
|--------|-------------------------------|--------------------------------|
| POST   | `/users/register`            | Register a new user           |
| GET    | `/users?email=...`           | Get user by email             |
| GET    | `/boards`                    | List all boards               |
| POST   | `/boards`                    | Create a board (via SQS)      |
| POST   | `/boards/{boardId}/messages` | Post a message to a board     |

---

## Real-Time Setup (WebSocket)

### Topics:

- `realtimeBroadcastTopic` SNS Topic triggers `broadcastMessage` Lambda.
- All WebSocket client `connectionIds` are saved in `WebSocketConnections` DynamoDB.

### Steps:

1. WebSocket clients connect (`$connect`) → stored in DynamoDB.
2. A message is posted → SNS triggers `broadcastMessage`.
3. Lambda retrieves all connection IDs → sends message via `@connections`.

### Sample SNS Publish:

```bash
aws sns publish   --topic-arn arn:aws:sns:ap-southeast-2:<your-account-id>:realtimeBroadcastTopic   --message '{"type":"notification", "message":"Hello WebSocket!"}'   --region ap-southeast-2
```

---

## Permissions

IAM Roles include:

- `dynamodb:*` for all relevant tables.
- `sqs:SendMessage`, `sns:Publish`
- `execute-api:ManageConnections` for WebSocket messaging.

---

## Manual Setup

Since SNS conflicts were frequent with stack management, we manually:

- Created SNS topics in AWS Console.
- Subscribed `createUser` and `processPostedMessage` Lambdas to them.

---

## Improvements with More Time

- Unit and integration test suites.
- Frontend interface with real-time UI.
- Auth (e.g., Cognito).
- Rate limiting & input validation.
- Analytics (CloudWatch dashboards).

---

## Author

Sudipta – for technical backend coding assessment using AWS + Serverless

