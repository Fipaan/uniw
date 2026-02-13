import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import schemas from "../validators/task.schemas.js";
import controllers from "../controllers/taskController.js";

const router = Router();

router.use("/", requireAuth);

router.post("/", schemas.create.validator, controllers.create);
router.get("/", controllers.list);
router.get("/:id", controllers.get);
router.put("/:id", schemas.update.validator, controllers.update);
router.delete("/:id", controllers.delete);

export default router;
