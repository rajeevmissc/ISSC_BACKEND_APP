const JobApplication = require("../models/jobApplicationModel");
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const sgMail = require("../config/emailConfig");
const moment = require("moment");

const blobUrl = process.env.AZURE_BLOB_URL;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;

// Create BlobServiceClient using SAS URL
const blobServiceClient = new BlobServiceClient(`${blobUrl}${sasToken}`);
const containerClient = blobServiceClient.getContainerClient("");

const submitJobApplication = async (req, res) => {
  try {
    const data = req.body;
    let resumeUrl = null;

    if (req.file) {
      const blobName = `${Date.now()}-${path.basename(req.file.originalname)}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });
      resumeUrl = blockBlobClient.url;
    }

    const newApplication = new JobApplication({ ...data, resume: resumeUrl });
    await newApplication.save();

    const formattedDate = moment().format("YYYY-MM-DD");
    const formattedTime = moment().format("HH:mm:ss");

    // ---------------- ADMIN EMAIL ----------------
    let adminFieldsHtml = "";
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        adminFieldsHtml += `
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px;">${key}</td>
            <td style="padding: 8px;">${data[key]}</td>
          </tr>`;
      }
    }
    if (resumeUrl) {
      adminFieldsHtml += `
        <tr>
          <td style="background-color: #5b3a7c; color: white; padding: 8px;">Resume</td>
          <td style="padding: 8px;"><a href="${resumeUrl}" target="_blank">Download</a></td>
        </tr>`;
    }
    adminFieldsHtml += `
      <tr>
        <td style="background-color: #5b3a7c; color: white; padding: 8px;">Submitted At</td>
        <td style="padding: 8px;">${formattedDate} ${formattedTime}</td>
      </tr>`;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>New Job Application Received:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          ${adminFieldsHtml}
        </table>
      </div>
    `;

    await sgMail.send({
      from: { email: process.env.SENDGRID_SENDER, name: "ISSC WebApp" },
      to: "sanketa@issc.co.in",
      subject: `New Job Application: ${data.firstName || ""} ${data.lastName || ""}`,
      html: adminHtml,
      text: `New job application received from ${data.firstName || ""} ${data.lastName || ""}.`,
    });

    // ---------------- USER ACKNOWLEDGMENT EMAIL ----------------
    const userHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear ${data.firstName || "Candidate"},</p>
        <p>Thank you for submitting your application for <strong>${data.applyForPosition || "the position"}</strong> at ISSC.</p>
        <p>We have successfully received your application and our HR team will review your profile carefully. You will be contacted regarding the next steps shortly.</p>
        <p>We appreciate your interest in joining ISSC and assure you that your details are securely received and will be handled with utmost confidentiality.</p>
        <p>Best regards,<br/>ISSC HR Team</p>
      </div>
    `;

    if (data.email) {
      await sgMail.send({
        from: { email: process.env.SENDGRID_SENDER, name: "ISSC WebApp" },
        to: data.email,
        subject: "Your Job Application has been received",
        html: userHtml,
        text: `Thank you for applying for ${data.applyForPosition || "the position"} at ISSC.`,
      });
    }

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
