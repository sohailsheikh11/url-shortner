import Url from "../models/url.js";
import generateShortCode from "../utils/generateShortCode.js";
export async function shortenUrl(req, res) {
    try {
        const { longUrl } = req.body;

        // check duplicate
        let existing = await Url.findOne({ longUrl });
        if (existing) {
            return res.json(existing);
        }

        let shortCode = generateShortCode();

        // ensure unique
        while (await Url.findOne({ shortCode })) {
            shortCode = generateShortCode();
        }

        const newUrl = await Url.create({
            shortCode,
            longUrl
        });

        res.status(201).json(newUrl);

    } catch (err) {
        res.status(500).json(err.message);
    }
}