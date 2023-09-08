import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connect from "../db.js";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const db = await connect("Redomat");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (user) {
            return res.status(404).json({ message: "User already exists!" });
        }

        const newUser = {
            username,
            email,
            password: hashedPassword,
        };

        await usersCollection.insertOne(newUser);

        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: "12h",
        });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = await connect("Redomat");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "12h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

export default router;