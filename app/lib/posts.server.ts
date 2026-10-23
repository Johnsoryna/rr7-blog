import { db } from "./db.server";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export function getPosts() {
  return db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC")
    .all() as Post[];
}

export function getPost(id: number) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;
}

export function createPost(title: string, body: string) {
  const result = db
    .prepare("INSERT INTO posts (title, body) VALUES (?, ?)")
    .run(title, body);
  return Number(result.lastInsertRowid);
}
