//to handlestudent related API logic, basically the brain of this API

const {//importing functions
    findTeacherByEmail,
    findStudentsByEmails,
    registerStudentToTeacher,
    findCommonStudents,
    findStudentsForNotification,
    resetDatabase: resetDatabaseModel
} = require('../models/studentModel');


// to register students to a teacher
const registerStudents = async (req, res) => { //asynce is used because need to wait for mysql to respond
    try {

        const { teacher, students } = req.body;
        // to validate request body
        if (!teacher || !students || !Array.isArray(students)) {// to validate hte input is students are missing or not in an array

            return res.status(400).json({
                message: 'Invalid request body'
            });

        }

        // checking if teacher exist
        const teachers = await findTeacherByEmail(teacher);

        if (teachers.length === 0) {

            return res.status(400).json({
                message: 'Teacher does not exist'
            });

        }

        //checking if students exist, by validating that every email in the request already exists in the database
        const existingStudents = await findStudentsByEmails(students);
        if (existingStudents.length !== students.length) {

            return res.status(400).json({
                message: 'One or more students do not exist'
            });

        }

        // get student IDs(convert students into ID)
        const studentIds = existingStudents.map(student => student.id);

        // creating the relationships inside the teacher_student junction table
        await registerStudentToTeacher(
            teachers[0].id,
            studentIds
        );

        return res.status(204).send();//the success response that is being sent

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            message: 'Something went wrong'
        });

    }

};

//to get common students
const getCommonStudents = async (req, res) => {

    try {

        let teachers = req.query.teacher;

        // to check if teacher parameter exists
        if (!teachers) {
            return res.status(400).json({
                message: "Teacher email is required"
            });
        }


        // if only one teacher is provided, convert it into an array
        if (!Array.isArray(teachers)) {
            teachers = [teachers];
        }

        const teacherIds = [];

        // find every teacher's ID
        for (const email of teachers) {

            const result = await findTeacherByEmail(email);
            if (result.length === 0) {
                return res.status(400).json({
                    message: "Teacher does not exist"
                });
            }


            teacherIds.push(result[0].id);
        }

        const students = await findCommonStudents(teacherIds);
        const studentEmails = students.map(student => student.email);

        return res.status(200).json({
            students: studentEmails
        });
    } catch(error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

const retrieveForNotifications = async (req, res) => {

    try {

        const { teacher, notification } = req.body;
        if (!teacher || !notification) {
            return res.status(400).json({
                message: "Teacher and notification are required"
            });
        }

        const teacherResult = await findTeacherByEmail(teacher);//converts to ID

        if (teacherResult.length === 0) {
            return res.status(400).json({
                message: "Teacher does not exist"
            });
        }

        const teacherId = teacherResult[0].id;
        const mentionedEmails = notification.match(//extracting the mentions in the email
            /@[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
        ) || [];
        const cleanEmails = mentionedEmails.map(email =>//removes @
            email.substring(1)
        );

        const students = await findStudentsForNotification(
            teacherId,
            cleanEmails
        );

        const recipients = students.map(student => student.email);
        return res.status(200).json({
            recipients
        });

    } catch(error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// reset database to initial state
const resetDatabase = async (req, res) => {
    try {
        await resetDatabaseModel();
        res.status(200).json({
            message: "Database reset successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {
    registerStudents,
    getCommonStudents,
    retrieveForNotifications,
    resetDatabase
};