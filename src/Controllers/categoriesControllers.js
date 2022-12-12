import connection from "../DB/pg.js";

export async function postCategory(req, res) {
    const body = req.body;

    try{
        const categoryVerify = await connection.query(`
        SELECT *
        FROM catedories
        WHERE name = $1
        `, [body.name]);

        if (categoryVerify.rowCount > 0) {
            return res.status(409).send("Category exist");
        }

        await connection.query(`
        INSERT INTO categories (name)
        VALUES ($1)
        `, [body.name]);

        res.status(201).send("Category created");

    }

    catch(error) {
        console.log(error);
    }
}

export async function getCategories(req, res) {
    try {
        const {rows: categories } = await connection.query(`
        SELECT *
        FROM categories
        `);
        res.status(200).send(categories);
    }
    
    catch(error) {
        console.log(error);
    }
}