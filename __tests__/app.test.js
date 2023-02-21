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
        console.log(">>> /api/categories tests <<<")
        
        test('endpoint has 200 status', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
        })
        test('returns an array of category objects', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;

                    expect(Array.isArray(categories)).toBe(true)
                })
        })
        test('category objects have slug, description properties', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;
                    categories.forEach((category)=>{
                        expect(Object.keys(category).length).toBe(2)

                        expect(category.toHaveProperty('slug', expect.any(String))).toBe(true)
                        expect(category.toHaveProperty('description', expect.any(String))).toBe(true)
                    })
                })
        })
    })

    describe.only('GET: /api/reviews', () => {
        console.log(">>> /api/reviews tests <<<")
        test('endpoint status 200', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
        })
        test('returns an array', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                    
                    expect(Array.isArray(body.reviews)).toBe(true)
                })
        })
        test('returns an array of review objects', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                    expect(Object.prototype.toString.call(body.reviews[0])).toBe('[object Object]')
                })
        })
        test('should have 9 length', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                    expect(Object.keys(body.reviews[0]).length).toBe(9)
                })
        })
        test('objects should have correct properties', () => {
            return request(app)
                .get("/api/reviews")
                .expect(200)
                .then(({body})=>{
                    body.reviews.forEach(review => {
                        expect(review.hasOwnProperty("owner", expect.any(String))).toBe(true)
                        expect(review.hasOwnProperty("title", expect.any(String))).toBe(true)
                        expect(review.hasOwnProperty("review_id", expect.any(Number))).toBe(true)
                        expect(review.hasOwnProperty("category", expect.any(String))).toBe(true)
                        expect(review.hasOwnProperty("review_img_url", expect.any(String))).toBe(true)
                        expect(review.hasOwnProperty("created_at", expect.any(Number))).toBe(true)
                        expect(review.hasOwnProperty("votes", expect.any(Number))).toBe(true)
                        expect(review.hasOwnProperty("designer", expect.any(String))).toBe(true)
                        expect(review.hasOwnProperty("comment_count", expect.any(Number))).toBe(true)
                    });
                })
        })
        test('return objects should be sorted by date in descending order', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                    const reviewDates = body.reviews.map((review)=>{
                        const date = review.created_at.substring(0,4) + review.created_at.substring(5,7) + review.created_at.substring(8,10)
                    
                        return parseInt(date,10)
                    });

                    for (let i = 1; i < reviewDates.length; i++) {
                        expect(reviewDates[i - 1] >= reviewDates[i]).toBe(true)
                    }
                })

        })
    })

    describe('errors', () => {
        console.log(">>> error handling tests <<<")

        test('responds 404 to non existent endpoint', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
        })
        test('repsonds with an appropriate error message', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
                .then(({body}) => {
                    console.log(body.msg)
                    console.log(body, "<<<<<")
                    expect(body.msg).toBe('Not Found')
                })
        })
    })
})