import connection from "../DB/pg.js";

export async function postGames(req, res) {
    try {
        const game = req.body;

        const gameVerify = await connection.query(`
        SELECT *
        FROM categories
        WHERE id = $1
        `, [game.categoryId]);

        if(gameVerify.rowCount === 0) {
            return res.status(400).send("Category ID is not found");
        }

        await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
        `,[game.name,
        game.image,
        Number(game.stockTotal),
        game.categoryId,
        Number(game.pricePerDay)]);

        res.status(201).send("Game created");
    }
    catch(error) {
        console.log(error);
    }
}

export async function getGames(req, res) {
    const { name } = req.query;

    try {
        const params = [];

        let filterGame = '';

        if (name) {
            params.push(`${name}%`);
            filterGame += `
            WHERE games.name
            ILIKE $${params.length}
            `;
        }

        const result = await connection.query(`
        SELECT games.*,
        categories.name
        AS "categoryName"
        FROM games
        JOIN categories
        ON categories.id=games."categoryId"
        ${filterGame}
        `, params);

        res.status(200).send(result.rows);
    }
    catch(error) {
        console.log(error);
    }
}