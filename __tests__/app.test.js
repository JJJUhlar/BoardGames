const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const reviews = require('../db/data/test-data/reviews')

// supertest re-seed database between tests
beforeEach(()=>{
    return seed(data)
})

// stop jest from hanging
afterAll(()=>{
    return db.end()
})

describe('appTests', () => {
   

    describe('GET: /api/categories', () => {        
        test('GET: 200 /api/categories', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;

                    expect(Array.isArray(categories)).toBe(true)

                    categories.forEach((category)=>{
                        expect(Object.keys(category).length).toBe(2)

                        expect(category).toHaveProperty('slug', expect.any(String));
                        expect(category).toHaveProperty('description', expect.any(String));
                    })
                })
        })
    })
    describe('GET: /api/reviews', () => {
        test('GET: 200 /api/reviews', () =>{
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body})=>{
                        
                expect(Array.isArray(body.reviews)).toBe(true)
                expect(Object.prototype.toString.call(body.reviews[0])).toBe('[object Object]')
                expect(Object.keys(body.reviews[0]).length).toBe(9)
                body.reviews.forEach(review => {
                    expect(review).toHaveProperty("owner", expect.any(String))
                    expect(review).toHaveProperty("title", expect.any(String))
                    expect(review).toHaveProperty("review_id", expect.any(Number))
                    expect(review).toHaveProperty("category", expect.any(String))
                    expect(review).toHaveProperty("review_img_url", expect.any(String))
                    expect(review).toHaveProperty("created_at", expect.any(String))
                    expect(review).toHaveProperty("votes", expect.any(Number))
                    expect(review).toHaveProperty("designer", expect.any(String))
                    expect(review).toHaveProperty("comment_count", expect.any(Number))
                    })
                
                const reviewDates = body.reviews.map((review)=>{
                const date = review.created_at.substring(0,4) + review.created_at.substring(5,7) + review.created_at.substring(8,10)
            
                return parseInt(date,10)
                    });

                for (let i = 1; i < reviewDates.length; i++) {
                    expect(reviewDates[i - 1] >= reviewDates[i]).toBe(true)
                    }
                
                });
            })
    
        test('GET: 200 /api/reviews/:review_id', ()=>{
            return request(app)
                .get('/api/reviews/1')
                .expect(200)
                .then(({body})=>{
                    const review = body.review;
                    
                    expect(Object.prototype.toString.call(review)).toBe('[object Object]')

                    expect(Object.keys(review).length).toBe(9)
                    expect(review).toHaveProperty('review_id', expect.any(Number))
                    expect(review).toHaveProperty('title', expect.any(String))
                    expect(review).toHaveProperty('review_body', expect.any(String))
                    expect(review).toHaveProperty('designer', expect.any(String))
                    expect(review).toHaveProperty('review_img_url', expect.any(String))
                    expect(review).toHaveProperty('votes', expect.any(Number))
                    expect(review).toHaveProperty('category', expect.any(String))
                    expect(review).toHaveProperty('owner', expect.any(String))
                    expect(review).toHaveProperty('created_at', expect.any(String))
                })
        })
        test('GET: 200 /api/reviews/:review_id/comments', () => {
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(({body})=>{
                    const comments = body.reviewComments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(Object.prototype.toString.call(comments[0])).toBe('[object Object]');
    
                    comments.forEach((comment)=>{
                        expect(Object.keys(comment).length).toBe(6)
                        expect(comment).toHaveProperty('comment_id', expect.any(Number))
                        expect(comment).toHaveProperty('votes', expect.any(Number))
                        expect(comment).toHaveProperty('created_at', expect.any(String))
                        expect(comment).toHaveProperty('author', expect.any(String))
                        expect(comment).toHaveProperty('body', expect.any(String))
                        expect(comment).toHaveProperty('review_id', expect.any(Number))
                    })
                    // should return in descending order (most recent first)
                    for (let i = 1; i < comments.length; i++) {
                        expect(Date.parse(comments[i-1].created_at) > Date.parse(comments[i].created_at)).toBe(true)
                    }
                })
        })
        test('GET: 200 /api/reviews/:review_id/comments | returns an empty array for an existing review_id with no comments', () => {
            return request(app)
                .get('/api/reviews/5/comments')
                .expect(200)
                .then(({body})=>{
                    const comments = body.reviewComments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(comments.length).toBe(0)
                })
        })
    })

    describe.skip('PATCH 202 /api/reviews/:review_id', () => {
        test('increments votes for a review by a given amount ', () => {
            const testPatch = {
                "inc_votes": 5 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    expect(body.updatedReview)
                })
        })
        test('decrements votes for a review by a specified amount', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    expect(body.updatedReview)
                })
        })
        test('ignores unncessary properties', () => {
            const testPatch = {
                "inc_votes": -5,
                "Extra property 1": "asldkjad",
                "Extra property 2": [12,3,,4,5,,6] 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    expect(body.updatedReview)
                })
        })
    })

    
    describe('Errors', () => {
        test('responds 404 to non existent path', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Not found! :'( ")
                })
        })
        test('responds 400 for bad review_id', () =>{
            return request(app)
                .get('/api/reviews/notanid')
                .expect(400)
                .then(({body})=>{

                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        
        test('GET: 404 /api/reviews/:review_id/notaroute ', () => {
            return request(app)
                .get('/api/reviews/3/bananapancakes')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe("Not found! :'( ")
                })
        })
        test('GET: 400 /api/reviews/:bad_review_id/comments', () => {
            return request(app)
                .get('/api/reviews/magicErrorThrowingCatapult/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        test('GET: 404 /api/reviews/:well_formed_but_non_existant_id/comments', () => {
            return request(app)
                .get('/api/reviews/99999990/comments')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No review found for this ID: 99999990')
                })
        })
            // /api/reviews/review_id/comments 
        
        test.skip('PATCH: 404 /api/reviews/:non_existant_review_id | errors for a well_formed for but non-existant review', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/99999')
                .send(testPatch)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('No review found for this ID: 99999')
                })
        })
        test.skip('PATCH: 400 /api/reviews/:not_a_valid_review_id | errors for a valid patch, but to a bad path', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/not_a_valid_path')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        test.skip('PATCH: 400 /api/reviews/:review_id | errors for a malformed patch request to a valid review_id', () => {
            const testPatch = {
                "inc_votes": "What happens if I'm *not* an integer!" 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        test.skip('PATCH: 400 /api/reviews/:review_id | errors for a well formed request but missing necessary properties', () => {
            const testPatch = {
                "not inc votes": "I should break your test" 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: missing inc_votes')
                })
        })
    })
})
