#How to set up DB with MySql:

CREATE DATABASE IF NOT EXISTS Timerecording;

USE Timerecording;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
password VARCHAR(255) NOT NULL
);

select `*` from users;

--> You should see 3 rows

insert into users (id, username, password)
VALUES (1,'fsa','123456');

--> take wathever you wand for the entries
--> password needs to be hashed, use "HelperHashPassword.js"

select `*` from users;

--> You should see the entries;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'XXPASSWORDXX';
FLUSH PRIVILEGES;

--> Create a table for the data in the form

CREATE TABLE timesheet (
id INT AUTO_INCREMENT PRIMARY KEY,
userId INT NOT NULL,
date DATE NOT NULL,
startTime TIME NOT NULL,
endTime TIME NOT NULL,
startTime1 TIME NOT NULL,
endTime1 TIME NOT NULL,
hoursNormal DECIMAL(5,2) NOT NULL,
overtime DECIMAL(5,2) NOT NULL,
comments VARCHAR(255),
FOREIGN KEY (userId) REFERENCES users(id)
);
