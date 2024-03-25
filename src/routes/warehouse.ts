import { Router } from "express";

import WarehouseController from "../controllers/warehouse";

const router: Router = Router();

router.post("/create", WarehouseController.createWarehouse);
router.get("", WarehouseController.getWarehouses);
router.put("/update/:warehouseId", WarehouseController.updateWarehouse);
router.delete("/delete/:warehouseId", WarehouseController.deleteWarehouse);

export default router;
