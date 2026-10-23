import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const navigation = useNavigation();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-blue-700 dark:text-blue-400"
      : "text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400";

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold">
          RR7 Blog
        </Link>
        <nav className="flex gap-6">
          <NavLink to="/" end className={linkClass}>
            Beiträge
          </NavLink>
          <NavLink to="/posts/new" className={linkClass}>
            Neuer Beitrag
          </NavLink>
        </nav>
      </div>
      <div
        className={`h-0.5 bg-blue-600 transition-all duration-500 ${
          navigation.state === "idle" ? "w-0 opacity-0" : "w-full opacity-100"
        }`}
      />
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Fehler";
  let details = "Es ist ein unerwarteter Fehler aufgetreten.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Fehler";
    details =
      error.status === 404
        ? "Diese Seite gibt es nicht."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">{message}</h1>
      <p className="mt-2">{details}</p>
      <Link
        to="/"
        className="mt-6 inline-block text-blue-700 underline dark:text-blue-400"
      >
        Zurück zur Übersicht
      </Link>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
