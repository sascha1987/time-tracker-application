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

select `*` from users;

--> You should see the entries;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'XXPASSWORDXX';
FLUSH PRIVILEGES;
