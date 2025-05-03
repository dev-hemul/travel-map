import { Schema, model } from "mongoose";

const schema = new Schema({
    name: String,
    url: String,
    description: String,
});

const modele = model('advertiments', schema);

export default modele;