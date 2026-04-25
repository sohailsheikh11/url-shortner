import { Schema, model } from "mongoose";

const urlSchema = new Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    longUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default model("Url", urlSchema);