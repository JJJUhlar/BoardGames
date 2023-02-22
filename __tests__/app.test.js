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
                    console.log(review)
                    
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
    })

    describe.skip('POST', () => {
        test('POST: /api/reviews/:review_id/comments', () => {
            const body = {
                "username": "joseph",
                "body": "I think this test game is amazing"
            }

            return request(app)
                .post('api/reviews/1/comments', body)
                .expect(201) // 'created'
                .then(({body})=>{
                    expect(body.msg).toEqual({
                        "username": "joseph",
                        "body": "I think this test game is amazing"
                    })
                })
        })
        test.todo('Rejects an invalid comment post (wrong properties or value types)')
        test.todo('Rejects a valid post to bad route ')
        test.todo('Rejects a valid post, to a well formed, but non-existant review')
    })
    
    describe('errors', () => {
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
    })
})
