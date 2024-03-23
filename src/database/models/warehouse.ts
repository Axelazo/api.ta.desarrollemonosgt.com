import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../../configuration/database";
import User from "./user";

class Warehouse extends Model<
  InferAttributes<Warehouse>,
  InferCreationAttributes<Warehouse>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare location: string;
  declare createdBy: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Warehouse.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "warehouses",
    sequelize,
  }
);

export default Warehouse;
