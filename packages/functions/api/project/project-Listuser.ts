
import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getUser, listUsers } from "../../data/user";
import { errorHandler } from "../util/errorHandler";


export const handler: APIGatewayProxyHandler = middy(
    async (event: APIGatewayProxyEvent) => {
        try {
            const userId = event.pathParameters?.userId;

            let result;

            if (userId) {
                result = await getUser(userId);
                if (!result) {
                    return {
                        statusCode: 404,
                        headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ message: "User not found" }),
                    };
                }
            } else {
                result = await listUsers();
            }

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(result),
            };
        } catch (error) {
            console.error('Error getting/listing users:', error);
            throw error; // This will be caught by the errorHandler middleware
        }
    }
)
.use(errorHandler());