import mysql from "mysql";
import bcrypt from "bcrypt";
import util from "util";
const saltRounds = 10;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fluor1987",
  database: "Timerecording",
});

const query = util.promisify(connection.query).bind(connection);

async function hashAndSavePasswords() {
  try {
    const users = await query("SELECT id, password FROM users");
    for (const user of users) {
      const hash = await bcrypt.hash(user.password, saltRounds);
      await query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
      console.log(`Passwort für Benutzer ${user.id} wurde aktualisiert.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}
hashAndSavePasswords();
