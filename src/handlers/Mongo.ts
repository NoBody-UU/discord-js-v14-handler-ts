import mongoose from "mongoose";
import { color } from "../functions";

module.exports = () => {
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) return console.log(color("mainColor",`[🍀] Mongo URI not found, ${color("errorColor", "skipping.")}`))
    mongoose.connect(`${MONGO_URI}/${process.env.MONGO_DATABASE_NAME}`)
    .then(() => console.log(color("mainColor",`[🍀] MongoDB connection has been ${color('secColor', "Established.")}`)))
    .catch(() => console.log(color('mainColor',`[🍀] MongoDB connection has been ${color("errorColor", "Failed.")}`)))
}