require("dotenv").config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { textureTshirtModel } = require("./model/texture");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


console.log("Server is running...",process.env.MONGODB_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG files are allowed'), false);
    }
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/addtexturetshirt", upload.single('image'), async (req, res) => {
  try {
    const { itemName, category, price } = req.body;
    const imagePath = req.file?.path;

    if (!imagePath) return res.status(400).send({ msg: "Image upload failed" });

    const newData = new textureTshirtModel({
      itemName,
      image: imagePath,
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

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
