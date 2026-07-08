# Student Management API

## Overview

This project is a RESTful API built with Node.js, Express and MySQL for managing teacher and student relationships.

The API allows teachers to:

- Register one or more students
- Retrieve students common to one or more teachers
- Retrieve students who should receive a notification while excluding suspended students

The application follows the MVC (Model-View-Controller) architecture to separate routing, business logic and database operations. Automated tests are included using Jest and Supertest.

## Tech Stack

- Node.js
- Express.js
- MySQL
- Jest
- Supertest
- dotenv

## Project Structure

```text
src
├── config
│   └── database.js
├── controllers
│   └── studentController.js
├── database
│   ├── schema.sql
│   └── seed.sql
├── models
│   └── studentModel.js
├── routes
│   └── studentRoutes.js
├── app.js
└── server.js

tests
└── student.test.js
```

## Getting Started

### 1. Install the dependencies

```bash
npm install
```

### 2. Create the database

Create a MySQL database called:

```sql
CREATE DATABASE student_management;
```

Run the SQL scripts in the following order:

1. `schema.sql`
2. `seed.sql`

Both files can be found in:

```text
src/database
```

### 3. Configure the environment variables

Create a `.env` file in the project root.

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME=student_management
MYSQL_PORT=3306
PORT=3000
```

### 4. Start the application

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Running the Tests

Run:

```bash
npm test
```

The test suite automatically resets the database before every test so that each test starts with the same baseline data.

## API Endpoints

### Register Students

```
POST /api/register
```

Registers one or more existing students to an existing teacher.

Example request:

```json
{
  "teacher": "teacherAlice@gmail.com",
  "students": ["studentAlan@gmail.com", "studentBen@gmail.com"]
}
```

### Retrieve Common Students

```
GET /api/commonstudents
```

Returns students who are registered under all specified teachers.

Example:

```
GET /api/commonstudents?teacher=teacherAlice@gmail.com&teacher=teacherBob@gmail.com
```

### Retrieve Notification Recipients

```
POST /api/retrievefornotifications
```

Returns all students who should receive the notification.

A recipient must:

- not be suspended
- be registered under the teacher, or
- be explicitly mentioned in the notification

Example request:

```json
{
  "teacher": "teacherBob@gmail.com",
  "notification": "Hello students! @studentDon@gmail.com @studentChloe@gmail.com"
}
```

### Reset Database

```
GET /api/reset
```

Restores the database to the original baseline data provided in the assessment. This endpoint is mainly used during development and automated testing.

## Design Decisions

A few design decisions were made while developing this project:

- The MVC architecture was used to separate routing, business logic and database queries.
- A junction table (`teacher_student`) is used because teachers and students have a many-to-many relationship.
- Parameterized SQL queries (`?`) are used throughout the project to help prevent SQL injection.
- Jest and Supertest were used to automate API testing.
- The database is reset before every test to ensure that tests are independent and repeatable.

## Testing

The automated tests cover:

- API availability
- Student registration
- Invalid teacher validation
- Retrieving common students
- Retrieving notification recipients

## Author

Developed by **Yohith V. Nyanasegaran**.
