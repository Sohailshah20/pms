import { z } from "zod";

export const bodyValidator = (schema: z.Schema) => ({
	before: (handler: { event: { body: any } }) => {
		const { body } = handler.event;
		if (!body) {
			throw new Error("empty request body!");
		}
		const data = JSON.parse(body);
		const result = schema.safeParse(data);
		if (!result.success) {
			throw new Error("invalid request body");
		}
	},
});
