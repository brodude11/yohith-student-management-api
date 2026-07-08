//API routes related to student management
//Each endpoint forwards the request to the appropriate controller


const express = require('express');

const router = express.Router();//creating a router to handle related endpoints
const {
    registerStudents,
    getCommonStudents,
    retrieveForNotifications,
    resetDatabase
} = require('../controllers/studentController');


// registering the students to a teacher for POST /api/register
router.post('/register', registerStudents);
// getting the common students for GET /api/commonstudents
router.get('/commonstudents', getCommonStudents);
// getting from notifciations 
router.post('/retrievefornotifications', retrieveForNotifications);
// getting the reset data request
router.get('/reset', resetDatabase);


module.exports = router;// export functionality to allow another file to use it 