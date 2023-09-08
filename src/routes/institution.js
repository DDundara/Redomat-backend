import express from "express";
import connect from "../db.js";
import authMiddleware from "../auth.js";
import { DBRef } from "mongodb";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, address, city_name } = req.body;

        const db = await connect("Redomat");
        const institutionCollection = db.collection("institutions");

        const citiesCollection = db.collection("cities");

        const city = await citiesCollection.findOne({ city_name });

        if (!city) {
            return res.status(404).json({ message: "No city found" });
        }

        console.log(city)

        const newInstitution = {
            name,
            address,
            city_id: new DBRef("cities", city._id)
        };

        await institutionCollection.insertOne(newInstitution);

        res.status(201).json({ message: "Institution added successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const db = await connect("Redomat");
        const institutionCollection = db.collection("institutions");

        const institutions = await institutionCollection
            .aggregate([
                {
                    $lookup: {
                        from: "cities",
                        localField: "city_id.$id",
                        foreignField: "_id",
                        as: "city",
                    },
                },
            ])
            .toArray();

        if (institutions.length == 0) {
            return res.status(404).json({ message: "No institutions found" });
        }

        res.status(200).json(institutions);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

export default router;