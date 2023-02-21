const db = require('../db/connection')

exports.selectCategories = () => { 
    return db.query('SELECT * FROM categories;')
        .then(({rows}) => {
            return rows
    })
}

exports.selectReviewsWithComCounts = () => {
    return db.query(`
                    SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comments.body) AS comment_count
                    FROM comments
                    RIGHT JOIN reviews
                    ON comments.review_id = reviews.review_id
                    GROUP BY reviews.review_id
                    ORDER BY reviews.created_at DESC;
                    `)
        .then(({rows})=>{
            // console.log(">>> selected reviews >>>", rows)
            return rows
        })
}

