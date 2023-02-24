const db = require('../db/connection')
const { sort } = require('../db/data/test-data/categories')

exports.selectCategories = () => { 
    return db.query('SELECT * FROM categories;')
        .then(({rows}) => {
            return rows
    })
}

exports.checkQueryParams = (category, sort_by, order) => {
    return db.query(`
                    `)
        .then(({rows}))
}

exports.selectReviewsWithComCounts = (category = 'social deduction', sort_by = 'created_at', order = 'DESC' ) => {

    if (!['ASC','DESC'].includes(order)) {
        return Promise.reject({status: 400, msg: 'Bad Request: Invalid order query'})
    }
    if (!['review_id','owner','title','category','created_at','votes','designer','comment_count','review_img_url'].includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Bad Request: Invalid sort query'})
    }

    let query = `
                SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comments.body) AS comment_count
                FROM comments
                RIGHT JOIN reviews
                ON comments.review_id = reviews.review_id
                WHERE category = $1
                GROUP BY reviews.review_id
                ORDER BY reviews.${sort_by} ${order};
                `;

    const check_category_promise = (category) => {
        return db.query(`
                        SELECT * FROM categories
                        WHERE slug = $1;
                        `,[category])
                .then((data)=>{
                    
                    if (data.rowCount === 0) {
                        return Promise.reject({status: 404, msg: `No reviews found for this category: ${category}`})
                    }
                    return category
                })
    }

    const filtered_query_promise = () => {
        return db
                .query(query, [category])
                .then(({rows, rowCount}) => {
                    if (rowCount === 0) {
                        return []
                    }
                    rows.forEach((row)=>{
                        row.comment_count = parseInt(row.comment_count)
                    })
                    return rows
        })
    }

    return check_category_promise(category)
                .then(()=>{
                    return filtered_query_promise()
                })
                
    // Promise.all([, ])
    
}

exports.checkReviewExists = (id) => {
   return db.query(`
                SELECT *
                FROM reviews
                WHERE review_id = $1;
                `, [id])
            .then(({rows})=>{
                const review = rows[0]
                if (!review) {
                    return Promise.reject({
                        status: 404,
                        msg: `No review found for this ID: ${id}`
                    })
                } else {
                    return id
                }
            })
}

exports.selectReviewCommentsByID = (id) => {
    return db.query(`
                    SELECT *
                    FROM comments
                    WHERE review_id = $1
                    ORDER BY created_at DESC;
                    `, [id])
        .then(({rows})=>{
            return rows
        })
    }

exports.selectReviewByID = (id) => {
    return db.query(`
                    SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at
                    FROM reviews
                    WHERE review_id = $1;
                    `, [id])
    .then(({rows}) => {
        return rows[0]
    })
}

exports.checkUserExists = (username) => {
    return db.query(`
                    SELECT *
                    FROM users
                    WHERE username = $1;
                    `, [username])
        .then(({rows})=> {
            const user = rows[0]
  
            if (!user) {
                return Promise.reject({
                    status: 404,
                    msg: `No user found with this name: ${username}`
                })
            } else {
                return user
            }
        })
}

exports.insertCommentToReviewByID = (review_id, username, body) => {
    return db.query(`
                    INSERT INTO comments
                        (body, review_id, author)
                    VALUES
                        ($1,$2,$3)
                    RETURNING *;
                    `, [body, review_id, username])
        .then(({rows})=>{
            return rows[0];
        })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
        .then(({rows})=>{
            return rows
        })
}