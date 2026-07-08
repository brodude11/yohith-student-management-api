# Student Management API

## Overview

This project is a RESTful API built with Node.js, Express and MySQL for managing teacher and student relationships.

The API allows teachers to:

- Register one or more students
- Retrieve students common to one or more teachers
- Retrieve students who should receive a notification while excluding suspended students
- Reset the database back to the original baseline data

The application follows the MVC (Model-View-Controller) architecture to separate routing, business logic and database operations. Automated tests are included using Jest and Supertest.

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Jest
- Supertest
- dotenv

---

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

---

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm
- MySQL Server

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/brodude11/yohith-student-management-api.git
cd yohith-student-management-api
```

### 2. Install the dependencies

```bash
npm install
```

### 3. Configure the environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values if your local MySQL configuration is different.

Example:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME=student_management
MYSQL_PORT=3306
PORT=3000
```

### 4. Set up the database

Open MySQL:

```bash
mysql -u root
```

If you already have a `student_management` database from a previous setup, you can remove it first so that you start with a clean database.

```sql
DROP DATABASE student_management;
```

Create the database:

```sql
CREATE DATABASE student_management;
USE student_management;
```

Create the tables and insert the baseline data:

```sql
SOURCE src/database/schema.sql;
SOURCE src/database/seed.sql;
```

### 5. Start the application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

---

## Running the Tests

Open another terminal while the application is running and execute:

```bash
npm test
```

The test suite automatically resets the database before each test run so that every test starts with the same baseline data.

---

## Verifying the Setup

After starting the application, you can verify that everything has been set up correctly.

Check that the API is running:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "message": "Student Management API is running"
}
```

You can also test one of the API endpoints:

```bash
curl "http://localhost:3000/api/commonstudents?teacher=teacherAlice@gmail.com"
```

Expected response:

```json
{
  "students": ["studentAlan@gmail.com", "studentDon@gmail.com"]
}
```

---

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

---

### Retrieve Common Students

```
GET /api/commonstudents
```

Returns students who are registered under all specified teachers.

Example:

```
GET /api/commonstudents?teacher=teacherAlice@gmail.com&teacher=teacherBob@gmail.com
```

---

### Retrieve Notification Recipients

```
POST /api/retrievefornotifications
```

Returns all students who are eligible to receive the notification.

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

---

### Reset Database

```
GET /api/reset
```

Restores the database to the original baseline data provided in the assessment. This endpoint is mainly used during development and automated testing.

---

## Design Decisions

Some design decisions made during development are listed below:

- The MVC architecture was used to separate routing, business logic and database queries.
- A junction table (`teacher_student`) is used because teachers and students have a many-to-many relationship.
- Parameterized SQL queries (`?`) are used throughout the project to help prevent SQL injection.
- Jest and Supertest were used to automate API testing.
- The database is reset before each test run so that every test starts with the same baseline data.

---

## Testing

The automated tests cover:

- API availability
- Student registration
- Invalid teacher validation
- Retrieving common students
- Retrieving notification recipients

---

## Additional Notes

A brief explanation of the project structure and implementation decisions can be found in:

```
CODE_EXPLANATION.md
```

---

## Author

Developed by **Yohith V. Nyanasegaran**
