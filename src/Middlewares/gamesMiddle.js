import gameSchema from "../Schemas/gamesSchema.js";

export function validateGame(req, res, next) {
    const game = req.body;

    const validation = gameSchema.validate(game);

    if(validation.error) {
        return res.status(400).send("Params incorrect");
    }

    next();
}