import { AnySchema, ValidationResult } from "joi";

/**
 * Validates the request body against the provided Joi schema.
 *
 * @template T - The type of the expected validation result.
 * @param {unknown} data - The data to validate.
 * @param {AnySchema} schema - The Joi schema to validate against.
 * @returns {ValidationResult<T>} - The validation result.
 * @throws {Error} - Throws an error if the validation process encounters an unexpected issue.
 *
 * @example
 * // Usage in an Express route
 * app.post('/create-client', (req, res) => {
 *   const validationResult = validateRequestBody<CreateClientDTO>(req.body, createClientSchema);
 *
 *   if (validationResult.error) {
 *     // Handle validation errors
 *     return res.status(400).json({
 *       error: 'Validation error',
 *       details: validationResult.error.details.map((err) => err.message),
 *     });
 *   }
 *
 *   // Continue with your logic if validation passes
 *   // ...
 *
 *   res.json({ success: true });
 * });
 */
const validateRequestBody = <T>(
  data: unknown,
  schema: AnySchema
): ValidationResult<T> => {
  return schema.validate(data, {
    abortEarly: false,
  }) as ValidationResult<T>;
};

export { validateRequestBody };
