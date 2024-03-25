import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AUTH_EXPIRES, AUTH_SECRET } from "../configuration/environment";
import { User } from "../database/models";

const verifyToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.headers.authorization) {
    return response.status(401).json({
      error: "Authorization Error",
      details: "No Authorization Headers found!",
    });
  }

  const token = request.headers.authorization.split(" ")[1];

  jwt.verify(token, AUTH_SECRET as string, (error, decoded) => {
    if (error) {
      return response.status(500).json({
        error: "Authorization Error",
        details: "Invalid token!",
      });
    }

    const { id } = decoded as any;

    const existingUser = User.findByPk(id);

    if (!existingUser) {
      return response.status(500).json({
        error: "Authorization Error",
        details: "The user doesn't exist!",
      });
    }

    next();
  });
};

const AuthMiddleware = {
  verifyToken,
};

export default AuthMiddleware;
