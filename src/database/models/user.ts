import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../../configuration/database";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare userName: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: "User Name needs to be at least 3 chars",
        },
      },
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email must be valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ],
          msg: "Password must contain at least a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        },
        len: {
          args: [8, 255],
          msg: "Password must contain at least 8 characters long",
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "users",
    sequelize,
  }
);

export default User;
