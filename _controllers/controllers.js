const {
    selectCategories,
    selectReviewsWithComCounts,
    selectReviewByID,
    selectReviewCommentsByID,
    checkReviewExists,
    insertCommentToReviewByID,
    checkUserExists
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

exports.postCommentToReviewByID = (req,res,next) => {
    const { review_id } = req.params
    console.log(req.body, "<<<< should be req.body")
    const { username, body } = req.body
    console.log(username, body, "<<< should be post username + body")

    // check review exists 
    // check user exists

    const check_user_exists_promise = checkUserExists(username)
    const review_id_check_promise = checkReviewExists(review_id)
    const insert_post_promise = insertCommentToReviewByID(review_id, username, body)

    Promise.all([insert_post_promise, review_id_check_promise, check_user_exists_promise])
        .then((result) => {
            console.log(result[0], "<<<< should be posted comment")
            res.status(201).send({"postedComment": result[0]})
        })
        .catch((err)=>{
            next(err)
        })
    
}