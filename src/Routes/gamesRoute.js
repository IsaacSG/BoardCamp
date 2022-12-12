import { Router } from "express";
import { postGames, getGames } from "../Controllers/gamesControllers.js";
import { validateGame } from "../Middlewares/gamesMiddle.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateGame, postGames);

export default router;