const express = require('express')
const db = require('./db/connection')
// require controllers

const {
    getCategories,
    getReviews,
    getReviewByID,
    getReviewCommentsByID,
    postCommentToReviewByID
} = require('./_controllers/controllers')
const {
    handle404noPaths,
    handle500s,
    handleCustomErrors
} = require('./_controllers/errorHandlingcontrollers')

// server
const app = express()


// add app.use json here
app.use(express.json())

// end points
app.get("/api/categories", getCategories)
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewByID)
app.get("/api/reviews/:review_id/comments", getReviewCommentsByID)

app.post("/api/reviews/:review_id/comments", postCommentToReviewByID)

// error handlers
app.use(handle404noPaths)
app.use(handleCustomErrors)
app.use(handle500s);

// custom errors



module.exports = app;