import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import dotenv from "dotenv"
import Url from './models/url.js'
import urlRoutes from "./routes/urlRoutes.js"
import authRoutes from "./routes/authRoute.js"

dotenv.config()


const app = express()

app.use(cors());
app.use(express.json());

// routes

app.use("/api/url", urlRoutes);
app.use("/api/v1", authRoutes);


app.get("/:shortCode", async (req, res) => {
    
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) return res.status(404).json("Not found");

    return res.redirect(url.longUrl);
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch(err => console.log(err));





app.listen(3000,()=>{
    console.log("this is running on server 3000")
})