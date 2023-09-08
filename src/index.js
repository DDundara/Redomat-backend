import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/user.js";
import cityRouter from "./routes/city.js";
import institutionRouter from "./routes/institution.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/city", cityRouter);
app.use("/institution", institutionRouter);

app.use("/", async (req, res) => {
    res.json({ test: "test" });
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port " + process.env.PORT);
});