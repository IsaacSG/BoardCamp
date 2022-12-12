import { Router } from "express";
import { getRentals, postRentals, finishRentals, deleteRentals } from "../Controllers/rentalsControllers.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentals);
router.post("/rentals/:findId/return", finishRentals);
router.delete("/rentals/:findId", deleteRentals);

export default router;