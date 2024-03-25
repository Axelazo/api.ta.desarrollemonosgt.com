import Joi from "joi";

const BaseUserSchema = Joi.object({
  userName: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])/)
    .regex(/\d/)
    .required()
    .messages({
      "string.min": "Password must be at least {{#limit}} characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter and one number",
    }), // Extracted from Reddit for validation of the password, so it ensures it contains at least one lowercase letter, one uppercase letter, one digit
});

export const UpdateUserSchema = BaseUserSchema;

export const CreateUserSchema = BaseUserSchema;
