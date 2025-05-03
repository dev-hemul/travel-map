import express from "express"
import cors from "cors";
const router = express.Router();
import UserModel from "../models/advertiments.js";

/* GET users listing. */
router.post('/admin', cors(), async (req, res, next) => {
  const { name, description, url } = req.body;
  console.log(`В БД передано: 
                title: ${name}
                description:${description}`);
  const doc = new UserModel();
  doc.name = name;
  doc.url = url;
  doc.description = description;
  await doc.save();
});

export default router;
