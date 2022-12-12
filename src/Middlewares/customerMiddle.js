import customerSchema from "../Schemas/customerSchema.js";

export function validateCustomer(req, res, next) {
    const customer = req.body;
    const validation = customerSchema.validate(customer);
    if (validation.error) {
        return res.status(400).send("Params incorrect");
    }

    next();
}