CREATE TABLE teachers (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
);


CREATE TABLE students (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    suspended TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
);


CREATE TABLE teacher_student (
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    PRIMARY KEY (teacher_id, student_id),

    FOREIGN KEY (teacher_id)
    REFERENCES teachers(id),

    FOREIGN KEY (student_id)
    REFERENCES students(id)
);