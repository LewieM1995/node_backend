import express from "express";
import multer from "multer";
import fs from "fs";

const cameraRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "/home/lmserver/Pictures/CameraUploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


// secret key check
cameraRouter.use((req, res, next) => {
  const token = req.headers["x-camera-token"];
  if (token !== process.env.ESP32_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  next();
});

cameraRouter.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log(`Received file: ${req.file.filename}`);
  res.status(200).json({ message: "Photo received", filename: req.file.filename });
});

export default cameraRouter;
