const express = require("express");
const { submitContactForm, getContacts} = require("../controller/contactController");
const router = express.Router();

router.post("/form", submitContactForm);
router.get("/getContacts", getContacts);

module.exports = router;
