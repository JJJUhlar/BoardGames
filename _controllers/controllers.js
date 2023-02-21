const {
    selectCategories,
    selectReviewsWithComCounts,
    selectReviewCommentsByID
} = require('../_models/models')

exports.getCategories = (request, response, next) => {
    return selectCategories()
        .then((categories) => {
            response.status(200).send({"categories": categories})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.getReviews = (req,res,next) => {
    return selectReviewsWithComCounts()
        .then((reviews)=>{
            res.status(200).send({"reviews": reviews})
        })
        .catch((err)=>{
            next(err);
        })
        
}

exports.getReviewCommentsByID = (req,res,next) => {
    
}