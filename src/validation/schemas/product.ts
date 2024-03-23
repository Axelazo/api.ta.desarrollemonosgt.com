import Joi from "joi";

const BaseProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).positive().required(),
});

export const UpdateProductSchema = BaseProductSchema;

export const CreateProductSchema = BaseProductSchema.keys({
  stock: Joi.number().min(1).positive().required(),
  warehouseId: Joi.number().min(1).positive().required(),
  userId: Joi.number().min(1).positive().required(),
});
