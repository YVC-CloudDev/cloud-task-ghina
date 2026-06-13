# Cloud Task Manager

Final project for Cloud Development course.

## Project Description
Cloud Task Manager is a serverless web application for managing tasks in the cloud.

Users can:
- Add a new task
- View all tasks
- Mark tasks as completed
- Delete tasks
- Refresh the task list

## Live System
https://cloud-task-ghina.proj.rotem.click

## GitHub Repository
https://github.com/YVC-CloudDev/cloud-task-ghina

## Project Track
Serverless Application

## Architecture
User → Route 53 → CloudFront → S3 Frontend → API Gateway → Lambda → DynamoDB

## AWS Services Used
- Amazon S3 – hosts the static frontend files
- Amazon CloudFront – distributes the frontend and provides HTTPS access
- AWS Certificate Manager (ACM) – manages the SSL/TLS certificate
- Amazon Route 53 – connects the subdomain to CloudFront
- Amazon API Gateway – exposes backend API endpoints
- AWS Lambda – runs the backend logic
- Amazon DynamoDB – stores task data
- Amazon CloudWatch – provides logs and metrics
- AWS IAM – manages secure permissions and roles

## CI/CD
The project uses GitHub Actions for automatic deployment.

When code is pushed to the main branch:
1. GitHub Actions starts the deployment workflow.
2. The workflow authenticates to AWS using an IAM Role with GitHub OIDC.
3. Frontend files are synced to the S3 bucket.
4. CloudFront cache is invalidated so users receive the newest version.

## Security
The project uses IAM Role authentication for CI/CD instead of long-term AWS access keys.

Security decisions:
- No AWS Access Keys or Secret Keys are stored in the repository.
- GitHub Actions uses OIDC to assume an IAM Role.
- The IAM Role has permissions only for S3 deployment and CloudFront invalidation.
- Sensitive values are stored in GitHub Actions Secrets.
- Lambda uses an execution role to access DynamoDB.
- HTTPS is enabled using ACM and CloudFront.

## Monitoring
Monitoring is implemented using CloudWatch:
- Lambda logs are available in CloudWatch Log Groups.
- Lambda metrics include Invocations, Duration, Errors and Concurrent Executions.

## Main API Endpoints
- GET /tasks
- POST /tasks
- PUT /tasks/{taskId}
- DELETE /tasks/{taskId}

## Technical Challenges
- Configuring CORS for browser requests
- Connecting API Gateway to Lambda
- Connecting the custom subdomain to CloudFront
- Replacing IAM User access keys with IAM Role authentication
- Managing CloudFront cache invalidation through CI/CD

## What We Learned
- How to build a serverless application on AWS
- How to connect frontend, API, Lambda and DynamoDB
- How to configure HTTPS with ACM and CloudFront
- How to use GitHub Actions for CI/CD
- How to improve security using IAM Roles and GitHub OIDC
