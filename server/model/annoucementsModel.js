import { Schema, model } from "mongoose";

const schema = new Schema({
    name: String,
    description: String,
});

const modele = model('announcements', schema, "announcements");

export default modele;