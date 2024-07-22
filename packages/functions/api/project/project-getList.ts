import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { listProjects } from "../../data/project";
import { errorHandler } from "../util/errorHandler";


export const handler: APIGatewayProxyHandler = middy(
    async (event: APIGatewayProxyEvent) => {
        try {
            const projects = await listProjects();

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ projects }),
            };
        } catch (error) {
            console.error('Error listing projects:', error);
            throw error; // This will be caught by the errorHandler middleware
        }
    }
)
.use(errorHandler());