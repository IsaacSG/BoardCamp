import { Router } from "express";
import { getCategories, postCategory } from "../Controllers/categoriesControllers.js";
import { validateCategory } from "../Middlewares/categoriesMiddle.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", validateCategory, postCategory);

export default router;