import { Router } from "express";
import { getCustomer, getCustomers, postCustomer, updateCustomer } from "../Controllers/customerControllers.js";
import { validateCustomer } from "../Middlewares/customerMiddle.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomer);
router.post("/customers", validateCustomer, postCustomer);
router.put("/customers/:id", validateCustomer, updateCustomer);

export default router;