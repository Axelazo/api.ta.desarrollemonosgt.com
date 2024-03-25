import { Request, Response } from "express";
import { Transaction } from "sequelize";

import { sequelize } from "../configuration/database";
import { User } from "../database/models";
import { CreateUserDTO } from "../dtos/user";
import { CreateUserSchema } from "../validation/schemas/user";
import { validateRequestBody } from "../validation/validate";

const createUser = async (request: Request, response: Response) => {
  const { userData }: { userData: CreateUserDTO } = request.body;

  if (!userData) {
    return response.status(409).json({
      message: `User Data is missing!`,
    });
  }

  const validationResult = validateRequestBody<CreateUserDTO>(
    userData,
    CreateUserSchema
  );

  if (validationResult.error) {
    return response.status(400).json({
      error: "Validation error",
      details: validationResult.error.details.map((err) => err.message),
    });
  }

  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const { userName, email, password } = userData;

    // Check if the email is already in use
    const existingUserWithSameEmail = await User.findOne({
      where: {
        email,
      },
      transaction,
    });

    if (existingUserWithSameEmail) {
      await transaction.rollback();

      return response.status(409).json({
        message: `The email isalready in use`,
      });
    }

    // Check if the userName is already in use
    const existingUserWithSameUsername = await User.findOne({
      where: {
        userName,
      },
      transaction,
    });

    if (existingUserWithSameUsername) {
      await transaction.rollback();

      return response.status(409).json({
        message: `The email isalready in use`,
      });
    }

    // Create the User record
    const newUser = await User.create(
      {
        userName,
        email,
        password,
      },
      { transaction }
    );
    await transaction.commit();

    response.status(200).json({ id: newUser.id });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    response.status(500).json({ error: "Error", details: error });
  }
};

const UserController = {
  createUser,
};

export default UserController;
