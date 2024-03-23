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
import Warehouse from "./warehouse";
import Product from "./product";

class WarehouseProduct extends Model<
  InferAttributes<WarehouseProduct>,
  InferCreationAttributes<WarehouseProduct>
> {
  declare id: CreationOptional<number>;
  declare productId: ForeignKey<Product["id"]>;
  declare warehouseId: ForeignKey<Warehouse["id"]>;
  declare stock: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

WarehouseProduct.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    productId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    warehouseId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    stock: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "warehousesProducts",
    sequelize,
  }
);

export default WarehouseProduct;
