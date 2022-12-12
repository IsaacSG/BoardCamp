import pg from "pg";

const { Pool } = pg;

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    database: 'boardcamp',
});

export default connection;