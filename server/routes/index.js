import express from "express";
import * as dbctrl from "../ctrl/advDbController.js";
const router = express.Router();

/* GET home page. */
router.get('/',  async (req, res, next) => {
  
  const result = await dbctrl.findItems();
  res.send(result)
});

export default router;
