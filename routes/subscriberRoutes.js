const express = require("express");
const { subscribeUser,getSubscribeUser } = require("../controller/subscriberController");
const router = express.Router();

router.post("/subscribe-mail", subscribeUser);
router.get("/subscribe-user", getSubscribeUser);

module.exports = router;
