import { Router } from "express";

import AuthController from "../controllers/auth";

const router: Router = Router();

router.post("/signin", AuthController.signIn);
router.get("/verify", AuthController.verifyToken);

export default router;
