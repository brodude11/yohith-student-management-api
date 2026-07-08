const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

//reset the database before running each every test so that it is consistent, every test starts from the same state
//this was done so that each test starts with the base data and is independent from other tests
beforeEach(async () => {
    await request(app).get('/api/reset');
});

describe('Student Management API', () => {

    test('GET / should return API status', async () => {

        const response = await request(app)
            .get('/');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: 'Student Management API is running'
        });
    });

    //curl -X POST http://localhost:3000/api/register \
    //-H "Content-Type: application/json" \
    //-d '{"teacher":"teacherAlice@gmail.com","students":["studentChloe@gmail.com"]}'
    test('POST /api/register should register a student successfully', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                teacher: "teacherAlice@gmail.com",
                students: [
                    "studentChloe@gmail.com"
                ]
            });
        expect(response.statusCode).toBe(204);
    
    });

    test('POST /api/register should return 400 for a non-existent teacher', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                teacher: "teacherUnknown@gmail.com",
                students: [
                    "studentAlan@gmail.com"
                ]
            });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
    
    });

    test('GET /api/commonstudents should return students for one teacher', async () => {
        const response = await request(app)
            .get('/api/commonstudents')
            .query({
                teacher: 'teacherAlice@gmail.com'
            });
    
        expect(response.statusCode).toBe(200);
    
        expect(response.body).toEqual({
            students: [
                'studentAlan@gmail.com',
                'studentDon@gmail.com'
            ]
        });
    });

    test('GET /api/commonstudents should return common students for two teachers', async () => {

        const response = await request(app)
            .get('/api/commonstudents')
            .query({
                teacher: [
                    'teacherAlice@gmail.com',
                    'teacherBob@gmail.com'
                ]
            });
        expect(response.statusCode).toBe(200);
    
        expect(response.body).toEqual({
            students: [
                'studentAlan@gmail.com'
            ]
        });
    });


    test('POST /api/retrievefornotifications should return notification recipients', async () => {

        const response = await request(app)
            .post('/api/retrievefornotifications')
            .send({
                teacher: "teacherBob@gmail.com",
                notification: "Hello students! @studentDon@gmail.com @studentChloe@gmail.com"
            });
    
        expect(response.statusCode).toBe(200);
    
        expect(response.body).toEqual({
            recipients: [
                "studentAlan@gmail.com",
                "studentChloe@gmail.com",
                "studentDon@gmail.com"
            ]
        });
    });
});





afterAll((done) => {
    db.end((err) => {
        if (err) {
            console.error(err);
        }
        done();
    });
});