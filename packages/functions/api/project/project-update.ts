import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { updateProject } from "../../data/project";
import { ProjectUpdateRequest } from "../../types/project";
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

            const updateData: ProjectUpdateRequest = JSON.parse(event.body || '{}');
            const updatedProject = await updateProject(projectId, updateData);

            if (!updatedProject) {
                return {
                    statusCode: 404,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Project not found" }),
                };
            }

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(updatedProject),
            };
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }
)
.use(errorHandler());