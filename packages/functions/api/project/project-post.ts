import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { addProject, getProjectByName } from "../../data/project";
import { ProjectRequest, ProjectRequestSchema } from "../../types/project";
import { bodyValidator } from "../util/bodyValidator";
import { errorHandler } from "../util/errorHandler";

export const handler: APIGatewayProxyHandler = middy(
	async (event: APIGatewayProxyEvent) => {
		const { name, description, startDate, endDate } = JSON.parse(
			event.body || "{}"
		) as ProjectRequest;
		const projectExists = await getProjectByName(name);
		if (projectExists.length > 0) {
			return {
				statusCode: 400,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					message: "Project with same name already exists",
				}),
			};
		}
		const project: ProjectRequest = {
			name,
			description,
			startDate,
			endDate,
		};
		const newProject = await addProject(project);
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(newProject),
		};
	}
)
	.use(bodyValidator(ProjectRequestSchema))
	.use(errorHandler());
