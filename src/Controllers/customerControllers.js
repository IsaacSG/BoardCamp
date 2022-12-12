import connection from "../DB/pg.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
      const params = [];
      let filterCustomer = '';
  
      if (cpf) {
        params.push(`${cpf}%`);
        filterCustomer += `WHERE cpf 
        ILIKE $${params.length}`;
      }
  
      const { rows: customers } = await connection.query(`
      SELECT * 
      FROM customers
      ${filterCustomer}
    `, params);
  
      res.status(200).send(customers);
    } 

    catch(error) {
      console.log(error);
    }
  }
  
  export async function getCustomer(req, res) {
    const { id } = req.params;
  
    try {
      const { rows: customer, rowCount } = await connection.query(`
        SELECT * 
        FROM customers 
        WHERE id = $1
        `, [id] );
  
      if (rowCount === 0) {
        return res.status(404).send("Id not founded");
      }
  
      res.status(200).send(customer[0]);
    } 

    catch(error) {
      console.log(error);
    }
  }
  
  export async function postCustomer(req, res) {
    try {
      const customer = req.body;
  
      const { rowCount } = await connection.query(
        'SELECT * FROM customers WHERE cpf = $1',
        [customer.cpf]
      );
  
      if (rowCount > 0) {
        return res.status(409).send("CPF existing");
      }
  
      await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)
        `,[customer.name, 
        customer.phone, 
        customer.cpf, 
        customer.birthday]
      );
  
      res.status(201).send("Customer created");
    } 

    catch(error) {
      console.log(error);
    }
  }

  export async function updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = req.body;
  
      const result = await connection.query(`
      SELECT * 
      FROM customers 
      WHERE cpf = $1 AND id <> $2
      `, [customer.cpf, id]
      );
  
      if (result.rowCount > 0) {
        return res.status(409).send("CPF existing");
      }
  
      await connection.query(`
      UPDATE customers 
      SET 
        name = $1, 
        phone = $2, 
        cpf = $3, 
        birthday = $4 
      WHERE id = $5
    `, [customer.name, customer.phone, customer.cpf, customer.birthday, id]
      );
  
      res.status(200).send("Customer uptade");
    } 
    
    catch(error) {
      console.log(error);
    }
  }