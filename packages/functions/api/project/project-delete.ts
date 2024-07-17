import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { deleteProject } from "../../data/project";
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

            await deleteProject(projectId);

            return {
                statusCode: 204,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: '',
            };
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
)
.use(errorHandler());