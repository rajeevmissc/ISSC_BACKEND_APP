const express = require("express");
const multer = require("multer");
const { submitJobApplication, getJobApplications } = require("../controller/jobApplicationController");

const router = express.Router();

// Multer: use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Submit job application with resume upload
router.post("/submit", upload.single("resume"), submitJobApplication);

// Fetch all applications
router.get("/get-jobapplication", getJobApplications);

module.exports = router;
