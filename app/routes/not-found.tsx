import { data, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/not-found";
import { NOT_FOUND_TITLE, RouteError } from "~/components/not-found";

export function meta({}: Route.MetaArgs) {
  return [{ title: NOT_FOUND_TITLE }];
}

export async function loader({}: Route.LoaderArgs) {
  throw data("Seite nicht gefunden", { status: 404 });
}

export default function NotFoundRoute() {
  return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteError status={isRouteErrorResponse(error) ? error.status : undefined} />;
}
