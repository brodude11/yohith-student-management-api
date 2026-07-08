INSERT INTO teachers (email) VALUES
('teacherAlice@gmail.com'),
('teacherBob@gmail.com'),
('teacherCharlie@gmail.com'),
('teacherDanny@gmail.com'),
('teacherEthan@gmail.com'),
('teacherFiona@gmail.com'),
('teacherGary@gmail.com');


INSERT INTO students (email, suspended) VALUES
('studentAlan@gmail.com', 0),
('studentBen@gmail.com', 1),
('studentChloe@gmail.com', 0),
('studentDon@gmail.com', 0),
('studentEllen@gmail.com', 1),
('studentFifi@gmail.com', 0),
('studentGina@gmail.com', 0);


INSERT INTO teacher_student (teacher_id, student_id) VALUES
(1, 1),
(1, 4),
(2, 1),
(2, 2),
(6, 1),
(6, 5);