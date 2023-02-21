const express = require('express')
const db = require('./db/connection')
// require controllers
const {getCategories, getReviews} = require('./_controllers/controllers')
const {handle404s, handle500s} = require('./_controllers/errorHandlingcontrollers')

const app = express()
// add app.use json here



app.get("/api/categories", getCategories)

// end points here to come

app.get("/api/reviews", getReviews)


// error handlers
app.use(handle404s);

app.use(handle500s);


module.exports = app;