import categorySchema from "../Schemas/categoriesSchema.js";

export function validateCategory(req, res, next) {
    const category = req.body;
    const validation = categorySchema.validate(category);
    if (validation.error) {
        return res.status(400).send("Name is required");
    }
    next();
}