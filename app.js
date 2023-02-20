const express = require('express')
const db = require('./db/connection')
// require controllers


const app = express()
// add app.use json here

app.get("/api/categories", (request, response, next) => {
    return db.query('SELECT * FROM categories;')
        .then(({rows}) => {
            
            return rows
        })
        .then((categories) => {
            response.status(200).send({"categories":categories})
        })
        .catch((error)=>{
            next(error)
        })

})

// end points here to come


// error handlers
app.use((err,request,response,next) => {
    console.log(err, "Caught an error")
    if(err.status === 404) {
        response.status(404).send({msg: "not found"})
    } else {
        response.status(err.status).send({msg: err.status})
    }    
})



module.exports = app;