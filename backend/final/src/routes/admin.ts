import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { UserRole } from "../models/User.js";
import controllers from "../controllers/adminController.js";

const router = Router();

router.use("/", requireAuth, requireRole(UserRole.Admin));

router.get("/users", controllers.listUsers);
router.get("/tasks", controllers.listTasks);

export default router;

