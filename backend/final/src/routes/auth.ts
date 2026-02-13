import { Router } from "express";
import controllers from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import schemas from "../validators/auth.schemas.js";

const router = Router();

router.post("/register", schemas.register.validator, controllers.register);
router.post("/login",    schemas.login.validator,    controllers.login);

router.use("/", requireAuth);

router.get("/status", controllers.status);
router.post("/logout", controllers.logout);

export default router;
