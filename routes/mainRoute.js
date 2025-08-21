const express = require('express');

const userRoute = require('../routes/userRoute')
const blogRoute = require('../routes/blogRoute')
const commentRoute = require('../routes/commentRoute')
const contactRoutes = require("../routes/contactRoutes");
const subscriberRoutes = require("../routes/subscriberRoutes");
const applyForm = require("../routes/jobApplicationRoutes")
const commonRouter = express.Router();

commonRouter.use('/user', userRoute)
commonRouter.use('/blog',blogRoute)
commonRouter.use('/comment',commentRoute)
commonRouter.use('/contact',contactRoutes)
commonRouter.use('/subscribers',subscriberRoutes)
commonRouter.use('/job-form',applyForm)
module.exports = commonRouter
