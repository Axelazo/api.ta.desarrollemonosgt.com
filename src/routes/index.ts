import express from "express";

import productRoutes from "./product";
import warehouseRoutes from "./warehouse";
import userRoutes from "./user";
import authRoutes from "./auth";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/warehouse", warehouseRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// config to make everything above fall under /api/...
router.use("/api", router);

export default router;
