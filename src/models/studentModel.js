const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// to find the teacher by email
const findTeacherByEmail = (email) => {

    return new Promise((resolve, reject) => {//promise used because mysql is asynchronous

        const query = 'SELECT * FROM teachers WHERE email = ?';//i have used ? as a placehold rather than putting "SELECT * FROM teachers WHERE email='" + email + "'", to prevent SQL injection
        db.query(query, [email], (error, results) => {

            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// to find students by their email addresses
const findStudentsByEmails = (emails) => {
    return new Promise((resolve, reject) => {

        const placeholders = emails.map(() => '?').join(',');

        const query = `
            SELECT * 
            FROM students 
            WHERE email IN (${placeholders})
        `;

        db.query(query, emails, (error, results) => {

            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// to register students under a teacher, by creating teacher-student relationships inside the junction table
// one teacher can be linked to multiple students, and one student can also belong to multiple teachers
const registerStudentToTeacher = (teacherId, studentIds) => {
    return new Promise((resolve, reject) => {
        const values = studentIds.map(studentId => [
            teacherId,
            studentId
        ]);

        const query = `
            INSERT INTO teacher_student 
            (teacher_id, student_id)
            VALUES ?
        `;

        db.query(query, [values], (error, results) => {

            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// find students who are registered with all given teachers
const findCommonStudents = (teacherIds) => {
    return new Promise((resolve, reject) => {

        //select student email by joining/connecting with their teachers, group rows by student, having count meaning to ensure the student was registered with every requested teacher
        const query = `
            SELECT students.email
            FROM students
            JOIN teacher_student
            ON students.id = teacher_student.student_id
            WHERE teacher_student.teacher_id IN (?)
            GROUP BY students.id
            HAVING COUNT(DISTINCT teacher_student.teacher_id) = ?
        `;

        db.query(
            query,
            [teacherIds, teacherIds.length],
            (error, results) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

// finding students who can receive notifications
const findStudentsForNotification = (teacherId, emails) => {
    return new Promise((resolve, reject) => {
        let query;
        let parameters;

        // if no students are mentioned in the notification, only retrieve the students registered under the teacher
        if (emails.length === 0) {

            //this query retrieves students who are not suspended and are registered with the given teacher
            //the LEFT JOIN connects students with the teacher_student relationship table so that can identify students assigned to the teacher

            //DISTINCT is used to prevent duplicate results by ensuring each student only appears once
            const queryWithoutMentions = `
                SELECT DISTINCT students.email
                FROM students
                LEFT JOIN teacher_student
                ON students.id = teacher_student.student_id
                WHERE students.suspended = 0
                AND teacher_student.teacher_id = ?
            `;
            query = queryWithoutMentions;
            parameters = [teacherId];

        } else {
            //this query retrieves students who are not suspended and are either registered with the given teacher or mentioned in the notification
            //the LEFT JOIN connects students with the teacher_student relationship table so that can identify students assigned to the teacher

            //the OR condition allows students mentioned using their email address to also be included

            //DISTINCT is used to prevent duplicate results by ensuring each student only appears once even if the student satisfies multiple conditions
            //for example: being registered under the teacher and also mentioned in the notification
            const queryWithMentions = `
                SELECT DISTINCT students.email
                FROM students
                LEFT JOIN teacher_student
                ON students.id = teacher_student.student_id
                WHERE students.suspended = 0
                AND (
                    teacher_student.teacher_id = ?
                    OR students.email IN (?)
                )
            `;
            query = queryWithMentions;
            parameters = [teacherId, emails];
        }

        db.query(
            query,
            parameters,
            (error, results) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

// reset database back to the original assessment data
const resetDatabase = () => {

    return new Promise((resolve, reject) => {
        const seedFile = path.join(
            __dirname,
            '../database/seed.sql'
        );

        const seedQuery = fs.readFileSync(
            seedFile,
            'utf8'
        );

        const queries = [
            'DELETE FROM teacher_student',
            'DELETE FROM students',
            'DELETE FROM teachers',
            'ALTER TABLE teacher_student AUTO_INCREMENT = 1',
            'ALTER TABLE students AUTO_INCREMENT = 1',
            'ALTER TABLE teachers AUTO_INCREMENT = 1'
        ];

        db.query(queries.join(';'), (error) => {

            if (error) {
                reject(error);
                return;
            }

            db.query(seedQuery, (error) => {

                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    });
};

module.exports = {
    findTeacherByEmail,
    findStudentsByEmails,
    registerStudentToTeacher,
    findCommonStudents,
    findStudentsForNotification,
    resetDatabase
};