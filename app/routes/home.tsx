import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { getPosts } from "~/lib/posts.server";
import { formatDate, toIsoDate } from "~/lib/date";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RR7 Blog" },
    {
      name: "description",
      content: "Ein kleiner Blog mit React Router v7 und SQLite.",
    },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return { posts: getPosts() };
}

let hasDrawn = false;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [drawing] = useState(() => !hasDrawn);

  useEffect(() => {
    hasDrawn = true;
  }, []);

  return (
    <>
      <header className="page-head">
        <h1 className="page-title">Alle Beiträge</h1>
        <p className="page-meta">
          {posts.length === 1 ? "1 Beitrag" : `${posts.length} Beiträge`}
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="route-empty">
          Noch keine Beiträge.{" "}
          <Link to="/posts/new" className="text-link">
            Schreib den ersten.
          </Link>
        </p>
      ) : (
        <ol className={drawing ? "route is-drawing" : "route"}>
          {posts.map((post, index) => (
            <li
              key={post.id}
              className="stop"
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className="stop-dot" aria-hidden="true" />
              <article className="stop-body">
                <p className="stop-date">
                  <time dateTime={toIsoDate(post.created_at)}>
                    {formatDate(post.created_at)}
                  </time>
                </p>
                <h2 className="stop-title">
                  <Link to={`/posts/${post.id}`} className="stop-link">
                    {post.title}
                  </Link>
                </h2>
                <p className="stop-excerpt">{post.body}</p>
              </article>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
