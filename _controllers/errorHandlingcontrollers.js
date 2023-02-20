
exports.handle404s = (err,req,res,next) => {
    console.log(err, "Caught an error")
    if(err.status === 404) {
        return res.status(404).send({msg: "Not Found"})
    } else {
        next(err)
    }           
}

exports.handle500s = (err,req,res,next) => {
    console.log(err.status, "<<< 500 error handler")

    res.status(500).send("internal server error")
    
};

//  psql error handler