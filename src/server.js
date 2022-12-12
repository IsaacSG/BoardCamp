import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRoute from "./Routes/categoriesRoute.js";
import customerRoute from "./Routes/customerRoute.js";
import gamesRoute from "./Routes/gamesRoute.js";
import rentalsRoute from "./Routes/rentalsRoute.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use(categoriesRoute);
app.use(customerRoute);
app.use(gamesRoute);
app.use(rentalsRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listen from ${PORT}`));