import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import controllers from "../controllers/userController.js";
import schemas from "../validators/user.schemas.js";

const router = Router();

router.use("/", requireAuth);

router.get("/profile", controllers.get);
router.put("/profile", schemas.update.validator, controllers.update);

export default router;
