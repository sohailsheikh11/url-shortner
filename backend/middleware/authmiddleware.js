import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {

        console.log("these are the headers", req.headers);
        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                "message": "please login first"
            });
        }

        // format: Bearer TOKEN
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // attach user info

        next(); // move to next function

    } catch (err) {
        return res.status(401).json("Invalid token");
    }
};