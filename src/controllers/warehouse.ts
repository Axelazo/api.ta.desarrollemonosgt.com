import { Request, Response } from "express";
import { Transaction } from "sequelize";

import { sequelize } from "../configuration/database";
import { Product, User, Warehouse } from "../database/models";
import WarehouseProduct from "../database/models/warehouseProduct";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "../dtos/warehouse";
import {
  CreateWarehouseSchema,
  UpdateWarehouseSchema,
} from "../validation/schemas/warehouse";
import { validateRequestBody } from "../validation/validate";

const createWarehouse = async (request: Request, response: Response) => {
  const { warehouseData }: { warehouseData: CreateWarehouseDTO } = request.body;

  if (!warehouseData) {
    return response.status(409).json({
      message: `Warehouse Data is missing!`,
    });
  }

  const validationResult = validateRequestBody<CreateWarehouseDTO>(
    warehouseData,
    CreateWarehouseSchema
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
    const { name, location, userId } = warehouseData;

    const existingUser = await User.findByPk(userId, { transaction });
    const existingWarehouseWithSameName = await Warehouse.findOne({
      where: { name },
      transaction,
    });

    if (!existingUser) {
      await transaction.rollback();

      return response.status(404).json({
        message: `User with ID: ${userId} was not found! or doesn't exist`,
      });
    }

    if (existingWarehouseWithSameName) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Theres already a Warehouse with the same name!`,
      });
    }

    // Create the transaction record
    const newWarehouse = await Warehouse.create(
      {
        name,
        location,
        createdBy: userId,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return response.status(200).json({ id: newWarehouse.id });
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const getWarehouses = async (request: Request, response: Response) => {
  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const products = await Warehouse.findAll({ transaction });

    await transaction.commit();

    if (products.length > 0) {
      return response.status(200).json(products);
    } else {
      return response.status(204).json(products);
    }
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const getProductsOfWarehouse = async (request: Request, response: Response) => {
  const { warehouseId } = request.params;

  if (!warehouseId) {
    return response.status(404).json({
      message: `Warehouse ID is required!`,
    });
  }

  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const existingWarehouse = await Warehouse.findOne({
      where: {
        id: warehouseId,
      },
    });

    if (!existingWarehouse) {
      return response.status(404).json({
        message: `Warehouse with ID: ${warehouseId} was not found! or doesn't exist`,
      });
    }

    const productsAssociatedToWarehouse = await WarehouseProduct.findAll({
      where: {
        warehouseId,
      },
    });

    const productsFromWarehouse: Product[] = [];

    for (const productAssociatedToWarehouse of productsAssociatedToWarehouse) {
      const product = await Product.findByPk(
        productAssociatedToWarehouse.productId
      );

      if (product) productsFromWarehouse.push(product);
    }

    await transaction.commit();

    if (productsFromWarehouse.length > 0) {
      return response.status(200).json(productsFromWarehouse);
    } else {
      return response.status(204).json(productsFromWarehouse);
    }
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const updateWarehouse = async (request: Request, response: Response) => {
  const { warehouseId } = request.params;

  const { warehouseData }: { warehouseData: UpdateWarehouseDTO } = request.body;

  if (!warehouseId) {
    return response.status(409).json({
      error: "Missing data",
      details: "The Warehouse ID is required!",
    });
  }

  if (!warehouseData) {
    return response
      .status(409)
      .json({ error: "Missing data", details: "Missing Warehouse data!" });
  }

  const validationResult = validateRequestBody<UpdateWarehouseDTO>(
    warehouseData,
    UpdateWarehouseSchema
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
    const { name, location } = warehouseData;

    const existingWarehouse = await Warehouse.findByPk(warehouseId, {
      transaction,
    });

    if (!existingWarehouse) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Warehouse with ID: ${warehouseId} was not found! or doesn't exist`,
      });
    }

    existingWarehouse.name = name;
    existingWarehouse.location = location;

    existingWarehouse.save({ transaction, hooks: true });

    await transaction.commit();

    return response.status(200).json({ id: existingWarehouse.id });
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const deleteWarehouse = async (request: Request, response: Response) => {
  const { warehouseId } = request.params;

  if (!warehouseId) {
    return response.status(409).json({
      error: "Missing data",
      details: "The warehouse ID is required!",
    });
  }

  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const existingWarehouse = await Warehouse.findByPk(warehouseId, {
      transaction,
    });

    if (existingWarehouse === null) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Warehouse with ID: ${warehouseId} was not found! or doesn't exist`,
      });

      return;
    }

    // Check if the Warehouse has products assigned
    const warehouseProducts = await WarehouseProduct.findAll({
      where: {
        warehouseId,
      },
    });

    if (warehouseProducts.length > 0) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Unable to delete Warehouse with ID: ${warehouseId} there are products associated!`,
      });
    }

    // Deletes the Product records and its existing associatons to Warehouses
    await WarehouseProduct.destroy({
      where: {
        warehouseId,
      },
      transaction,
    });

    // Delete the Warehouse record
    await existingWarehouse.destroy({ transaction });

    await transaction.commit();

    return response.status(200).json(existingWarehouse.id);
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const WarehouseController = {
  createWarehouse,
  getWarehouses,
  getProductsOfWarehouse,
  updateWarehouse,
  deleteWarehouse,
};

export default WarehouseController;
