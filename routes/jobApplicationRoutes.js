const express = require("express");
const { uploadResume, submitJobApplication, getJobApplications } = require("../controller/jobApplicationController");
const multer = require("multer");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store resumes in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Job application submission with file upload
router.post("/submit", upload.single("resume"), submitJobApplication);

// Fetch all applications
router.get("/get-jobapplication", getJobApplications);

module.exports = router;
