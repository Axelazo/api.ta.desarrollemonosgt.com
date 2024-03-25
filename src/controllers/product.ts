import { Request, Response } from "express";
import { Transaction } from "sequelize";

import { sequelize } from "../configuration/database";
import { Product, User, Warehouse } from "../database/models";
import WarehouseProduct from "../database/models/warehouseProduct";
import {
  CreateProductDTO,
  UpdateProductDTO,
  UpdateProductStockDTO,
} from "../dtos/product";
import {
  CreateProductSchema,
  UpdateProductSchema,
  UpdateProductStockSchema,
} from "../validation/schemas/product";
import { validateRequestBody } from "../validation/validate";

const createProduct = async (request: Request, response: Response) => {
  const { productData }: { productData: CreateProductDTO } = request.body;

  if (!productData) {
    return response.status(409).json({
      message: `Product Data is missing!`,
    });
  }

  const validationResult = validateRequestBody<CreateProductDTO>(
    productData,
    CreateProductSchema
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
    const { name, description, price, stock, warehouseId, userId } =
      productData;

    const existingUser = await User.findByPk(userId, { transaction });
    const existingWarehouse = await Warehouse.findByPk(warehouseId, {
      transaction,
    });

    if (!existingWarehouse) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Warehouse with ${warehouseId} was not found! or doesn't exist`,
      });
    }

    if (!existingUser) {
      await transaction.rollback();

      return response.status(404).json({
        message: `User with ID: ${userId} was not found! or doesn't exist`,
      });
    }

    // Create product record
    const newProduct = await Product.create(
      {
        name,
        description,
        price,
        createdBy: userId,
      },
      {
        transaction,
      }
    );

    // Associate the newly created Product to the given Warehouse by default
    const newProductWarehouse = await WarehouseProduct.create(
      {
        productId: newProduct.id,
        warehouseId,
        stock,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    response.status(200).json({ id: newProduct.id });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    response.status(500).json({ error: "Error", details: error });
  }
};

const getProducts = async (request: Request, response: Response) => {
  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const products = await Product.findAll({ transaction });

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

const updateProduct = async (request: Request, response: Response) => {
  const { productId } = request.params;

  console.log(productId);
  const { productData }: { productData: UpdateProductDTO } = request.body;

  if (!productId) {
    return response
      .status(409)
      .json({ error: "Missing data", details: "The product ID is required!" });
  }

  if (!productData) {
    return response
      .status(409)
      .json({ error: "Missing data", details: "Missing product data!" });
  }

  const validationResult = validateRequestBody<UpdateProductDTO>(
    productData,
    UpdateProductSchema
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
    const { name, description, price } = productData;

    // Check if the Product  exists, and also the provided Warehouse exist
    const existingProduct = await Product.findByPk(productId, { transaction });

    if (!existingProduct) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Product with ID: ${productId} was not found! or doesn't exist`,
      });
    }

    //Update the Product record
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.save({ transaction, hooks: true });

    await transaction.commit();

    response.status(200).json({ id: existingProduct.id });
  } catch (error) {
    await transaction.rollback();
    response.status(500).json({ error: "Error", details: error });
  }
};

const updateProductStockInWarehouse = async (
  request: Request,
  response: Response
) => {
  const { productId, warehouseId } = request.params;

  const {
    updateProductStockData,
  }: { updateProductStockData: UpdateProductStockDTO } = request.body;

  if (!productId) {
    return response.status(409).json({
      error: "Missing data",
      details: "The Product ID is required!",
    });
  }

  if (!warehouseId) {
    return response.status(409).json({
      error: "Missing data",
      details: "The Warehouse ID is required!",
    });
  }

  if (!updateProductStockData) {
    return response.status(409).json({
      error: "Missing data",
      details: "Missing Productt in Warehouse data!",
    });
  }

  const validationResult = validateRequestBody<UpdateProductStockDTO>(
    updateProductStockData,
    UpdateProductStockSchema
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
    const { stock } = updateProductStockData;

    // Check that the Warehouse record exists
    const existingWarehouse = await Warehouse.findByPk(warehouseId, {
      transaction,
    });

    if (!existingWarehouse) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Warehouse with ID: ${warehouseId} was not found! or doesn't exist`,
      });
    }

    // Check that the Product record exists
    const existingProduct = await Product.findByPk(productId, { transaction });

    if (!existingProduct) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Product with ID: ${warehouseId} was not found! or doesn't exist`,
      });
    }

    // Check that the Product record is associated to the Warehouse
    const existingProductWarehouseRelation = await WarehouseProduct.findOne({
      where: {
        warehouseId,
        productId,
      },
      transaction,
    });

    if (!existingProductWarehouseRelation) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Product with ID: ${productId} is not associated to the given Warehouse with ID: ${warehouseId}`,
      });
    }

    // Update the stock of the Product record off the given Warehouse
    existingProductWarehouseRelation.stock = stock;
    existingProductWarehouseRelation.save({ transaction, hooks: true });

    await transaction.commit();

    return response.status(200).json({ id: existingWarehouse.id });
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const deleteProduct = async (request: Request, response: Response) => {
  const { productId } = request.params;

  if (!productId) {
    return response
      .status(409)
      .json({ error: "Missing data", details: "The product ID is required!" });
  }

  let transaction: Transaction;
  transaction = await sequelize.transaction();

  try {
    const existingProduct = await Product.findByPk(productId, { transaction });

    if (!existingProduct) {
      await transaction.rollback();

      return response.status(404).json({
        message: `Product with ID: ${productId} was not found! or doesn't exist`,
      });
    }

    // Check if the Product has stock on at least one Warehouse
    const productOnWarehouses = await WarehouseProduct.findAll({
      where: {
        productId,
      },
      transaction,
    });

    for (const productOnWarehouse of productOnWarehouses) {
      if (productOnWarehouse.stock > 0) {
        await transaction.rollback();

        return response.status(404).json({
          message: `Unable to delete product with ID: ${productId} it has stock!`,
        });
      }
    }

    // Deletes the Product records and its existing associatons to Warehouses
    await WarehouseProduct.destroy({
      where: {
        productId,
      },
    });

    // Delete the Product record
    await existingProduct.destroy({ transaction });

    await transaction.commit();

    return response.status(200).json(existingProduct.id);
  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({ error: "Error", details: error });
  }
};

const ProductController = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};

export default ProductController;
