import { data, isRouteErrorResponse, Link } from "react-router";
import type { Route } from "./+types/posts.$postId";
import { getPost } from "~/lib/posts.server";
import { formatDate, toIsoDate } from "~/lib/date";
import { NOT_FOUND_TITLE, RouteError } from "~/components/not-found";

export function meta({ loaderData, error }: Route.MetaArgs) {
  if (error || !loaderData) {
    return [{ title: NOT_FOUND_TITLE }];
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
      <nav className="trail" aria-label="Navigationspfad">
        <Link to="/" className="trail-link">
          <span className="trail-dot" aria-hidden="true" />
          Alle Beiträge
        </Link>
        <span className="trail-line" aria-hidden="true" />
        <span className="trail-dot is-current" aria-hidden="true" />
        <span className="visually-hidden" aria-current="page">
          {post.title}
        </span>
      </nav>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-date">
        <time dateTime={toIsoDate(post.created_at)}>
          {formatDate(post.created_at)}
        </time>
      </p>
      <div className="post-body">{post.body}</div>
    </article>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <RouteError status={isRouteErrorResponse(error) ? error.status : undefined} />
  );
}
