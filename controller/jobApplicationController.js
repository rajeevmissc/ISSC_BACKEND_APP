const JobApplication = require("../models/jobApplicationModel"); // Your Mongoose Model

const submitJobApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, currentCTC, expectedCTC, noticePeriod, portfolioLink } = req.body;
    const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Store application data in MongoDB
    const newApplication = new JobApplication({
      firstName,
      lastName,
      email,
      phone,
      currentCTC,
      expectedCTC,
      noticePeriod,
      portfolioLink,
      resume: resumePath, // Store file path
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", resumePath });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
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

module.exports = { submitJobApplication, getJobApplications};
