import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connection } from "./server.js";

const router = Router();
const JWT_SECRET = "TestSecretKey";

// Middleware to authenticate requests using JWT in the Authorization header.
// Verifies the token and proceeds if valid, sends 401 or 403 status if not.
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

// Route definitions for handling HTTP POST requests.
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT id, username, password FROM users WHERE username = ?";

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
          res.send({ success: true, token, username: results[0].username });
        } else {
          console.log("result_false: ", match);
          res.send({ success: false, message: "Incorrect password" });
          console.log("res.send: ", res.send);
        }
      } catch (error) {
        console.error("Error during password verification: ", error);
        return res.status(500).send({ success: false, message: "Error during password verification" });
      }
    } else {
      res.send({ success: false, message: "Username not found" });
    }
  });
});

router.post("/save-timesheet", authenticateJWT, (req, res) => {
  const { timeSheetData } = req.body;
  const userId = req.userId;
  let errors = 0;
  let processed = 0;

  timeSheetData.forEach((data) => {
    const { date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments } = data;
    const formattedDate = date.split(".").reverse().join("-");
    const sqlSelect = "SELECT id FROM timesheet WHERE date = ? AND userId = ?";
    const cleanHoursNormal = hoursNormal ? parseFloat(hoursNormal).toFixed(2) : "0.00";
    const cleanOvertime = overtime ? parseFloat(overtime).toFixed(2) : "0.00";
    connection.query(sqlSelect, [formattedDate, userId], (err, results) => {
      if (err) {
        console.error("Error querying database", err);
        errors++;
      } else if (results.length > 0) {
        const sqlUpdate =
          "UPDATE timesheet SET startTime = ?, endTime = ?, startTime1 = ?, endTime1 = ?, hoursNormal = ?, overtime = ?, comments = ? WHERE date = ? AND userId = ?";
        connection.query(
          sqlUpdate,
          [startTime, endTime, startTime1, endTime1, cleanHoursNormal, cleanOvertime, comments, formattedDate, userId],
          (err) => {
            if (err) {
              console.error("Error updating database", err);
              errors++;
            }
            processed++;
            if (processed === timeSheetData.length) {
              if (errors > 0) {
                res.status(500).send({ message: "Error while storing data" });
              } else {
                res.send({ message: "Data saved successfully" });
              }
            }
          }
        );
      } else {
        const sqlInsert =
          "INSERT INTO timesheet (userId, date, startTime, endTime, startTime1, endTime1, hoursNormal, overtime, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(
          sqlInsert,
          [userId, formattedDate, startTime, endTime, startTime1, endTime1, cleanHoursNormal, cleanOvertime, comments],
          (err) => {
            if (err) {
              console.error("Error inserting into database", err);
              errors++;
            }
            processed++;
            if (processed === timeSheetData.length) {
              if (errors > 0) {
                res.status(500).send({ message: "Error while storing data" });
              } else {
                res.send({ message: "Data saved successfully" });
              }
            }
          }
        );
      }
    });
  });
});

router.get("/get-timesheet", authenticateJWT, (req, res) => {
  const userId = req.userId;
  const sql = "SELECT * FROM timesheet where userId = ?";
  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error("Error while retrieving data:", err);
      return res.status(500).send({ message: "Fehler beim Abrufen der DAten" });
    }
    res.json(result);
  });
});

router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "geschützte Info." });
});

router.get("/verify-token", authenticateJWT, (req, res) => {
  res.sendStatus(200);
});

export default router;
