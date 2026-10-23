import { data, Link } from "react-router";
import type { Route } from "./+types/posts.$postId";
import { getPost } from "~/lib/posts.server";
import { formatDate } from "~/lib/date";

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Beitrag nicht gefunden | RR7 Blog" }];
  }
  return [
    { title: `${loaderData.post.title} | RR7 Blog` },
    { name: "description", content: loaderData.post.body.slice(0, 150) },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = getPost(Number(params.postId));
  if (!post) {
    throw data("Beitrag nicht gefunden", { status: 404 });
  }
  return { post };
}

export default function PostDetail({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <article>
      <Link
        to="/"
        className="text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        ← Alle Beiträge
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {formatDate(post.created_at)}
      </p>
      <div className="mt-6 whitespace-pre-line leading-relaxed">
        {post.body}
      </div>
    </article>
  );
}
