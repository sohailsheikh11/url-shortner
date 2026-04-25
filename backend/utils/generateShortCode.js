const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateShortCode(length = 6) {
    let shortCode = "";

    for (let i = 0; i < length; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return shortCode;
}

export default generateShortCode;