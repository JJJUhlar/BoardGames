const express = require('express')
const db = require('./db/connection')
// require controllers
const {
    getCategories,
    getReviews,
    getReviewCommentsByID
} = require('./_controllers/controllers')
const {
    handle404noPaths,
    handle400s, 
    handle500s
} = require('./_controllers/errorHandlingcontrollers')

// server
const app = express()


// add app.use json here


// end points
app.get("/api/categories", getCategories)
app.get("/api/reviews", getReviews)


app.get("/api/reviews/:review_id/comments", getReviewCommentsByID)

// error handlers
app.use(handle404noPaths)
// app.use(handle400s);
app.use(handle500s);

// custom errors



module.exports = app;