import { Joi } from "express-validation";

export const jsonPatch = Joi.array()
	.min(1)
	.items(
		Joi.object({
			op: Joi.string()
				.valid("add", "copy", "move", "remove", "replace", "test")
				.required(),
			path: Joi.string().required(),
			from: Joi.string(),
			value: Joi.any(),
		})
	);
