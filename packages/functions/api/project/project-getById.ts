import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getProjectById } from "../../data/project";
import { errorHandler } from "../util/errorHandler";

export const handler: APIGatewayProxyHandler = middy(
    async (event: APIGatewayProxyEvent) => {
        try {
            const projectId = event.pathParameters?.id;

            if (!projectId) {
                return {
                    statusCode: 400,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Project ID is required" }),
                };
            }

            const project = await getProjectById(projectId);

            if (!project) {
                return {
                    statusCode: 404,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Project not found" }),
                };
            }

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(project),
            };
        } catch (error) {
            console.error('Error getting project:', error);
            throw error; // This will be caught by the errorHandler middleware
        }
    }
)
.use(errorHandler());
