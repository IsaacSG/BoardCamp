import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRoute from "./Routes/categoriesRoute.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use(categoriesRoute);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => console.log(`Server listen from ${PORT}`));