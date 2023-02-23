const {
    selectCategories,
    selectReviewsWithComCounts,
    selectReviewByID,
    selectReviewCommentsByID,
    checkReviewExists,
    insertNewVotes
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

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;

    return selectReviewByID(review_id)
        .then((result)=>{
            res.status(200).send({"review": result});
        })
        .catch((err)=>{
            next(err);
        })
}

exports.getReviewCommentsByID = (req,res,next) => {
    const { review_id } = req.params;
    const id_check_promise = checkReviewExists(review_id)
    const review_comments_promise = selectReviewCommentsByID(review_id)

    Promise.all([review_comments_promise, id_check_promise])
        .then((result) => {
            res.status(200).send({"reviewComments": result[0]})
        })
        .catch((err)=>{
            next(err);
        })
}

exports.updateReviewVotes = (req,res,next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    if (!inc_votes) {
        next({status: 400, msg: "Invalid Input: missing inc_votes"})
    }

    
    return insertNewVotes(review_id, inc_votes)
        .then((result) => {

            res.status(202).send({"updatedReview": result})
        })
        .catch((err)=>{
            next(err)
        })
        

}