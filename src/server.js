import express from "express";
import mysql from "mysql";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const port = 5500;

app.use(cors());
app.use(express.json());
app.use(routes);

// Connection to the database
export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fluor1987",
  database: "Timerecording",
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
