// api/index.js
const express = require("express");
const { createServer } = require("http");
const { parse } = require("url");
const app = express();
const serverless = require("serverless-http");

require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { textureTshirtModel } = require("./model/texture");

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"));

const storage = multer.memoryStorage(); // Because diskStorage won’t work!
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/addtexturetshirt", upload.single("image"), async (req, res) => {
  try {
    const { itemName, category, price } = req.body;
    const image = req.file?.buffer.toString("base64");

    if (!image) return res.status(400).send({ msg: "Image upload failed" });

    const newData = new textureTshirtModel({
      itemName,
      image, // Store as base64 or upload to Cloudinary/S3
      category,
      price: parseFloat(price)
    });

    await newData.save();
    res.send({ msg: "Data Added" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

app.get("/getTshirtsCategoryWise/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const data = await textureTshirtModel.find({ category });
    res.send(data);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// ✅ EXPORT instead of listen()
module.exports = app;
module.exports.handler = serverless(app);
