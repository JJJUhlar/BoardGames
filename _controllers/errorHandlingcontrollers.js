exports.handle404noPaths = (req, res, next) => {
    res.status(404).send({msg: "Not found! :'( "})
}

exports.handle400BadId = (err,req,res,next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid Input: bad review ID'})
    } else {
        next(err);
    }
}

exports.handle500s = (err,req,res,next) => {
    console.log(err.status)
    res.status(500).send("internal server error")
};

// not an id/bad request