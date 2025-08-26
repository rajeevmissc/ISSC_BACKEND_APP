const JobApplication = require("../models/jobApplicationModel");
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");

const blobUrl = process.env.AZURE_BLOB_URL;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;

// Create BlobServiceClient using SAS URL
const blobServiceClient = new BlobServiceClient(`${blobUrl}${sasToken}`);
const containerClient = blobServiceClient.getContainerClient("");

const submitJobApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, currentCTC, expectedCTC, noticePeriod, applyForPosition, jobId, tellmeAboutYou, portfolioLink } = req.body;

    let resumeUrl = null;

    if (req.file) {
      const blobName = `${Date.now()}-${path.basename(req.file.originalname)}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload file buffer directly
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });

      resumeUrl = blockBlobClient.url; // Azure URL
    }

    const newApplication = new JobApplication({
      firstName,
      lastName,
      email,
      phone,
      currentCTC,
      expectedCTC,
      noticePeriod,
      applyForPosition,
      jobId,
      tellmeAboutYou,
      portfolioLink,
      resume: resumeUrl,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", resumeUrl });
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { submitJobApplication, getJobApplications };
