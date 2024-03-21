import express from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 5500;

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

  // SQL query to get user information
  const sql = "SELECT password FROM users WHERE username = ?";
  //console.log("sql: ", sql);

  connection.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).send({ message: "Server error" });
    }
    console.log("Database result: ", results); // Passwort müsste stimmen!
    console.log("Database result username: ", username); // Username stimmt ebenfalls gem. Datenbank

    if (results.length > 0) {
      console.log("Hashed password from database: ", results[0].password);
      // Checking the password
      try {
        const match = await bcrypt.compare(password, results[0].password);
        console.log("Password comparison result: ", match);
        if (match) {
          res.send({ success: true });
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

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
