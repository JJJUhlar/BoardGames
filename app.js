const express = require('express')
const db = require('./db/connection')
// require controllers
const {getCategories, getReviews, getReviewByID} = require('./_controllers/controllers')
const {handle404noPaths, handle400BadId, handle500s} = require('./_controllers/errorHandlingcontrollers')

// server
const app = express()


// add app.use json here
app.use(express.json())

// end points
app.get("/api/categories", getCategories)
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewByID)

// error handlers
app.use(handle404noPaths)
app.use(handle400BadId);
app.use(handle500s);

// custom errors



module.exports = app;