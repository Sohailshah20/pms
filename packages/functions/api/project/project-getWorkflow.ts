import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getWorkflow } from "../../data/workflow";
import { errorHandler } from "../util/errorHandler";


export const handler: APIGatewayProxyHandler = middy(
    async (event: APIGatewayProxyEvent) => {
        try {
            const projectId = event.pathParameters?.id;

            if (!projectId) {
                return {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ message: "Project ID is required" }),
                };
            }

            const workflows = await getWorkflow(projectId);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ workflows }),
            };
        } catch (error) {
            console.error('Error listing workflows:', error);
            throw error; // This will be caught by the errorHandler middleware
        }
    }
)
.use(errorHandler());