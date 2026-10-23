import { Link } from "react-router";
import type { Route } from "./+types/home";
import { getPosts } from "~/lib/posts.server";
import { formatDate } from "~/lib/date";

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

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <h1 className="text-3xl font-bold">Alle Beiträge</h1>
      {posts.length === 0 ? (
        <p className="mt-6">
          Noch keine Beiträge.{" "}
          <Link
            to="/posts/new"
            className="text-blue-700 underline dark:text-blue-400"
          >
            Schreib den ersten.
          </Link>
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
          {posts.map((post) => (
            <li key={post.id} className="py-4">
              <Link
                to={`/posts/${post.id}`}
                className="text-xl font-semibold text-blue-700 hover:underline dark:text-blue-400"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(post.created_at)}
              </p>
              <p className="mt-2 line-clamp-2">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
