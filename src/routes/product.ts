import { Router } from "express";

import ProductController from "../controllers/product";

const router: Router = Router();

router.post("/create", ProductController.createProduct);
router.get("", ProductController.getProducts);
router.put("/update/:productId", ProductController.updateProduct);
router.delete("/delete/:productId", ProductController.deleteProduct);

export default router;
