import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import { SignInDTO } from "../dtos/auth";
import { User } from "../database/models";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AUTH_EXPIRES, AUTH_SECRET } from "../configuration/environment";

const signIn = async (request: Request, response: Response) => {
  const { signinData }: { signinData: SignInDTO } = request.body;

  if (!signinData) {
    return response.status(409).json({
      error: "Missing data",
      details: "The Sign In data is missing!",
    });
  }

  const { email, password } = signinData;

  if (!email) {
    return response.status(409).json({ message: "Email is required" });
  }

  if (!password) {
    return response.status(409).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return response
        .status(401)
        .json({ message: "The email is not registered" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return response.status(401).json({ message: "Wrong email or password" }); // Don't let the user know what is wrong
    }

    const token = jwt.sign({ id: user.id }, AUTH_SECRET as string, {
      expiresIn: "24h" as string,
    });

    return response.status(200).json({
      data: {
        user: user.id,
        email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error });
  }
};

const verifyToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { token } = request.query;

  console.log(token);

  try {
    jwt.verify(
      token as string,
      AUTH_SECRET as string,
      (error: any, decoded: any) => {
        if (error) {
          return response.status(500).json({
            error: "Authorization Error",
            details: "Invalid token!",
          });
        } else {
          return response.status(200).json({
            message: "The token is validfound!",
          });
        }
      }
    );
  } catch (error) {
    return response.status(500).json({
      error: "Authorization Error",
      details: "There was a problem trying to verify the token!",
    });
  }
};

const AuthController = {
  signIn,
  verifyToken,
};

export default AuthController;
