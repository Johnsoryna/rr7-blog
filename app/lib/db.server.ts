import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH ?? path.resolve("data/blog.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const { count } = db.prepare("SELECT COUNT(*) AS count FROM posts").get() as {
  count: number;
};

if (count === 0) {
  const insert = db.prepare("INSERT INTO posts (title, body) VALUES (?, ?)");
  insert.run(
    "Hallo React Router",
    "Das ist der erste Beitrag in meinem Blog. Er läuft mit React Router v7 im Framework Mode, die Daten kommen aus einer SQLite-Datenbank."
  );
  insert.run(
    "Loader und Actions",
    "Jede Route kann einen loader haben, der die Daten auf dem Server lädt, und eine action, die Formulare verarbeitet. Dadurch funktioniert das Formular auch ohne JavaScript im Browser."
  );
}
