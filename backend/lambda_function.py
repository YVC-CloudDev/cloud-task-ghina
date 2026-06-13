import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("CloudTasks")


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(body)
    }


def lambda_handler(event, context):
    try:
        method = event.get("requestContext", {}).get("http", {}).get("method")
        path = event.get("rawPath", "")

        if method == "OPTIONS":
            return response(200, {"message": "CORS OK"})

        if method == "GET" and path == "/tasks":
            result = table.scan()
            tasks = result.get("Items", [])
            return response(200, tasks)

        if method == "POST" and path == "/tasks":
            body = json.loads(event.get("body", "{}"))

            task = {
                "taskId": str(uuid.uuid4()),
                "title": body.get("title", ""),
                "completed": False,
                "createdAt": datetime.utcnow().isoformat()
            }

            table.put_item(Item=task)
            return response(201, task)

        if method == "PUT" and path.startswith("/tasks/"):
            task_id = path.split("/")[-1]
            body = json.loads(event.get("body", "{}"))
            completed = body.get("completed", False)

            table.update_item(
                Key={"taskId": task_id},
                UpdateExpression="SET completed = :completed",
                ExpressionAttributeValues={":completed": completed}
            )

            return response(200, {"message": "Task updated"})

        if method == "DELETE" and path.startswith("/tasks/"):
            task_id = path.split("/")[-1]
            table.delete_item(Key={"taskId": task_id})
            return response(200, {"message": "Task deleted"})

        return response(404, {"message": "Route not found"})

    except Exception as e:
        return response(500, {"error": str(e)})
