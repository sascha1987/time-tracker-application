import express from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const port = 5500;
const JWT_SECRET = "TestSecretKey";

app.use(cors());
app.use(express.json());

// Connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fluor1987",
  database: "Timerecording",
});

// Handling the login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT password FROM users WHERE username = ?";

  connection.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).send({ message: "Server error" });
    }
    console.log("Database result: ", results);
    console.log("Database result username: ", username);

    if (results.length > 0) {
      console.log("Hashed password from database: ", results[0].password);
      try {
        const match = await bcrypt.compare(password, results[0].password);
        console.log("Password comparison result: ", match);
        if (match) {
          const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
          res.send({ success: true, token });
          console.log("token", token);
        } else {
          console.log("result_false: ", match);
          res.send({ success: false, message: "Incorrect password" });
          console.log("res.send: ", res.send);
        }
      } catch (error) {
        console.error("Error during password verification: ", error);
        return res
          .status(500)
          .send({ success: false, message: "Error during password verification" });
      }
    } else {
      res.send({ success: false, message: "Username not found" });
    }
  });
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log("authHeader", authHeader);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post("/save-timesheet", authenticateJWT, (req, res) => {
  const { timeSheetData } = req.body;
  console.log("app.post(/save-timesheet");

  timeSheetData.forEach((data) => {
    const { date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments } =
      data;
    const sql =
      "INSERT INTO timesheet (date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments) VALUES ?";
    const values = [
      [date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments],
    ];

    connection.query(sql, [values], function (err, result) {
      if (err) {
        console.log("Error while inserting to the databse", err);
        return res.status(500).send({ message: "Errer while storing data" });
      }
    });
  });
  res.send({ message: "Data saved successfully" });
});

app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "geschützte Info." });
});

app.get("/verify-token", authenticateJWT, (req, res) => {
  res.sendStatus(200);
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
