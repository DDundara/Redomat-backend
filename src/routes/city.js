import express from "express";
import connect from "../db.js";
import authMiddleware from "../auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, postal_code } = req.body;

        const db = await connect("Redomat");
        const citiesCollection = db.collection("cities");

        const newCity = {
            name, postal_code
        };

        await citiesCollection.insertOne(newCity);

        res.status(201).json({ message: "City added successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const db = await connect("Redomat");
        const citiesCollection = db.collection("cities");

        const cities = await citiesCollection.find().toArray();
        if (cities.length == 0) {
            return res.status(404).json({ message: "No cities found" });
        }

        res.status(200).json(cities);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const cityId = req.params.id;
        const db = await connect("Redomat");
        const citiesCollection = db.collection("cities");

        const city = await citiesCollection.findOne(cityId);

        if (!city) {
            return res.status(404).json({ message: "No city found" });
        }

        res.status(200).json(city);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

export default router;