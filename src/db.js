import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

let db = null;

export default async function connect(database) {
    if (!db) {
        try {
            await client.connect();
            db = client.db(database);
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
            throw err;
        }
    }
    return db;
}