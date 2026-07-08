# Code Explanation

This document gives a brief explanation of how the project is organised and the purpose of each file.

## Overall Structure

I used the MVC (Model-View-Controller) architecture because it separates the application into different layers.

- Routes handle incoming API requests.
- Controllers contain the application logic.
- Models interact with the MySQL database.
- Config stores shared configuration such as the database connection.

Keeping these responsibilities separate makes the project easier to read and maintain.

---

## database.js

### Purpose

Creates a connection to the MySQL database and exports it so it can be reused throughout the application.

### Reason for this approach

Instead of creating multiple database connections, the application creates one shared connection that every model can use. Database credentials are stored in environment variables instead of being hardcoded.

---

## app.js

### Purpose

Creates the Express application, registers middleware and API routes, then exports the application.

### Reason for separating app.js and server.js

Keeping the Express application separate allows it to be imported directly into the Jest test suite without starting the server. This makes testing much easier using Supertest.

---

## server.js

### Purpose

Starts the Express server after loading the environment variables.

### Reason for this approach

This keeps the server startup separate from the application configuration, making the project easier to test and maintain.

---

## studentRoutes.js

### Purpose

Defines all API endpoints required for the assessment and forwards requests to the controller.

### Reason for this approach

Keeping routing separate from the controller avoids placing business logic inside the route definitions.

---

## studentController.js

### Purpose

Handles the application's business logic.

Responsibilities include:

- validating requests
- checking whether teachers and students exist
- calling model functions
- returning HTTP responses
- handling errors

### Reason for this approach

The controller focuses on application logic while leaving database queries to the model layer.

---

## studentModel.js

### Purpose

Contains all SQL queries used by the application.

This includes:

- finding teachers
- finding students
- registering students
- retrieving common students
- retrieving notification recipients
- resetting the database

### Reason for this approach

Keeping SQL queries inside one file makes them easier to manage and avoids mixing SQL with controller logic.

Parameterized queries (`?`) are used throughout the project to reduce the risk of SQL injection.

---

## schema.sql

### Purpose

Creates the database tables used by the application.

The database contains three tables:

- teachers
- students
- teacher_student

The `teacher_student` table represents the many-to-many relationship between teachers and students.

---

## seed.sql

### Purpose

Populates the database with the baseline data provided in the assessment.

### Reason for this approach

Using a seed file allows the database to be recreated easily and provides consistent data during development and testing.

---

## student.test.js

### Purpose

Contains automated tests using Jest and Supertest.

The tests verify the main API endpoints required by the assessment.

### Reason for this approach

Automated testing helps ensure the API behaves correctly after changes are made.

The database is reset before every test so each test starts with the same data.
