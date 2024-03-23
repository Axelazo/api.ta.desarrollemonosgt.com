import Joi from "joi";

const BaseWarehouseSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
});

export const UpdateWarehouseSchema = BaseWarehouseSchema;

export const CreateWarehouseSchema = BaseWarehouseSchema.keys({
  userId: Joi.number().min(1).positive().required(),
});
