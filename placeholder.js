const app = require('./app')
const db = require('./db/connection')

exports.getReviews = (req,res,next) => {
    return db.query(`   SELECT * FROM reviews
                        ORDER BY created_at
                        RETURNING *;`)
        .then(({rows})=>{
            console.log(">>> reviews >>>", rows)
            return rows
        })
        .then((reviews)=>{
            res.status(200).send({"reviews": reviews})
        })
        .catch((err)=>{
            next(err);
        })
        
}




describe('GET: /api/reviews', () => {
    test('endpoint status 200', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
    })
    test('returns an array', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({reviews})=>{
                expect(Array.isArray(reviews)).toBe(true)
            })
    })
    test('returns an array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({reviews})=>{
                expect(Object.prototype.toString.call(reviews[0])).toBe('[object Object')
            })
    })
    test('should have 9 length', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({reviews})=>{
                expect(Object.keys(reviews).length).toBe(9)
            })
    })
    test('objects should have correct properties', () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({reviews})=>{
                reviews.forEach(review => {
                    expect(review).hasOwnProperty("owner", expect.any(String))
                    expect(review).hasOwnProperty("title", expect.any(String))
                    expect(review).hasOwnProperty("review_id", expect.any(Number))
                    expect(review).hasOwnProperty("category", expect.any(String))
                    expect(review).hasOwnProperty("review_img_url", expect.any(String))
                    expect(review).hasOwnProperty("created_at", expect.any(Number))
                    expect(review).hasOwnProperty("votes", expect.any(Number))
                    expect(review).hasOwnProperty("designer", expect.any(String))
                    expect(review).hasOwnProperty("comment_count", expect.any(Number))
                });
            })
    })
    test.todo('return objects should be sorted by date in descending order')
})