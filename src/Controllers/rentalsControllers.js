import connection from "../DB/pg.js";
import dayjs from "dayjs";
import { rentalsSchema } from "../Schemas/rentalsSchema.js";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    const firstValidate = customerId ? [customerId] : gameId ? [gameId] : ''
    const mixId = customerId ? 'AND c.id = $1' : gameId ? 'AND g.id = $1' : ''

    try {
        const { rows: rentals } = await connection.query(
            `SELECT r.*, r."rentDate"::VARCHAR, 
                (CASE
                    WHEN r."returnDate"::VARCHAR != 'null' THEN r."returnDate"::VARCHAR
                    ELSE null
                END) as "returnDate", 
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name
                ) as customer,
                jsonb_build_object(
                    'id', g.id, 
                    'name', g.name, 
                    'categoryId', g."categoryId", 
                    'categoryName', ca.name
                ) as game
            FROM rentals r, customers c, games g, categories ca
            WHERE r."customerId" = c.id 
            AND r."gameId" = g.id 
            AND g."categoryId" = ca.id
            ${mixId}`, firstValidate)

        res.send(rentals).status(200);
    }

    catch(error) {
        console.log(error);
    }
}

export async function postRentals(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    const day = dayjs().format('YYYY-MM-DD');

    try {
        const validate = rentalsSchema.validate({customerId, gameId, daysRented});
        if (validate.error) {
            return res.sendStatus(400)
        }
        const customer = await connection.query('SELECT * FROM customers WHERE id=$1', [customerId]);
        if(customer.rows.length === 0) {
            return res.sendStatus(400)
        }
        const game = await connection.query('SELECT * FROM games WHERE id=$1', [gameId]);
        if(game.rows.length === 0 ) {
            return res.sendStatus(400)
        }
        const basePrice = game.rows[0].pricePerDay;
        const originalPrice = basePrice * daysRented;
        
        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',[customerId, gameId, day, daysRented, null, originalPrice, null]);
        return res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
    }
}

export async function finishRentals(req, res) {
    const { findId } = req.params;

    try {
        const { rows: rental } = await connection.query('SELECT * FROM rentals WHERE id = $1', [findId]);
        const { rows: game } = await connection.query('SELECT * FROM games WHERE id = $1', [rental[0].gameId]);
        if(rental.length === 0) {
            return res.sendStatus(404)
        } 
        if(rental[0].returnDate !== null) {
            return res.sendStatus(400)
        } 
        else {
            const delayFee = dayjs().diff(rental[0].rentDate, 'day')

            await connection.query(
                `UPDATE rentals 
                SET "returnDate" = $1, "delayFee" = $2
                WHERE id = $3`, [dayjs().format('YYYY-MM-DD'), delayFee * game[0].pricePerDay, findId])
            res.sendStatus(200);
        }
    }

    catch(error) {
        console.log(error);
    }
}

export async function deleteRentals(req, res) {
    const {findId} = req.params;

    try {
        const {rows: item} = await connection.query('SELECT * FROM rentals WHERE id = $1', [findId]);
        if(item.length === 0) {
            return res.sendStatus(404)
        }
        if(item[0].returnDate !== null) {
            return res.sendStatus(400)
        }
        await connection.query('DELETE FROM rentals WHERE id= $1', [findId]);
        return res.sendStatus(200);
    }

    catch(error) {
        console.log(error);
    }
    
}