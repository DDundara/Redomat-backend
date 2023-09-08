import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Get the token part after "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    }
}

export default authMiddleware