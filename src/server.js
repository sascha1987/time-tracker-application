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
  const sql = "SELECT id, password FROM users WHERE username = ?";

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
          const userId = results[0].id;
          const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
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
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log("authHeader", authHeader);
      req.userId = decoded.id;
      console.log("req.userId:", req.userId);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post("/save-timesheet", authenticateJWT, (req, res) => {
  const { timeSheetData } = req.body;
  const userId = req.userId;
  let errors = 0;

  timeSheetData.forEach((data, index, array) => {
    const { date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments } =
      data;
    const formattedDate = date.split(".").reverse().join("-");
    const formattedHoursNormal = parseFloat(data.hoursNormal).toFixed(2);
    console.log("formattedHoursNormal: ", formattedHoursNormal);
    const sql =
      "INSERT INTO timesheet (userId, date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments) VALUES ?";
    const values = [
      [
        userId,
        formattedDate,
        startTime,
        endTime,
        startTime1,
        endTime1,
        formattedHoursNormal,
        overtime,
        comments,
      ],
    ];

    connection.query(sql, [values], function (err, result) {
      if (err) {
        console.error("Error while inserting to the database", err);
        errors++;
      }
      // Only send the response when the last iteration is complete
      if (index === array.length - 1) {
        if (errors > 0) {
          res.status(500).send({ message: "Error while storing data" });
        } else {
          res.send({ message: "Data saved successfully" });
        }
      }
    });
  });
});

app.get("/get-timesheet", authenticateJWT, (req, res) => {
  const userId = req.userId;
  const sql = "SELECT * FROM timesheet where userId = ?";
  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error("Error while retrieving data:", err);
      return res.status(500).send({ message: "Fehler beim Abrufen der DAten" });
    }
    res.json(result);
    //    console.log("result: ", result);
  });
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
