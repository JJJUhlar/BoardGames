const express = require('express')
const db = require('./db/connection')
// require controllers

const {
    getUsers,
    getEndPoints,
    getCategories,
    getReviews,
    getReviewByID,
    getReviewCommentsByID,
    postCommentToReviewByID,
    deleteComment
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

app.get("/api/users", getUsers)
app.get("/api", getEndPoints)

app.delete("/api/comments/:comment_id", deleteComment)

// error handlers
app.use(handle404noPaths)
app.use(handleCustomErrors)
app.use(handle500s);

// custom errors



module.exports = app;