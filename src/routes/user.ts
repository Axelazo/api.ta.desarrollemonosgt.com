import { Router } from "express";

import UserController from "../controllers/user";

const router: Router = Router();

router.post("/create", UserController.createUser);

export default router;
