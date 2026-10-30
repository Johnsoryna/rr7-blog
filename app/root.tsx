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
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./app.css";

export function meta({ error }: Route.MetaArgs) {
  if (!error) {
    return [];
  }
  return [
    {
      title:
        isRouteErrorResponse(error) && error.status === 404
          ? "Seite nicht gefunden | RR7 Blog"
          : "Fehler | RR7 Blog",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const navigation = useNavigation();

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="wordmark">
          <span className="wordmark-dot" aria-hidden="true" />
          RR7 Blog
        </Link>
        <nav className="site-nav" aria-label="Hauptnavigation">
          <NavLink to="/" end className="nav-link">
            Beiträge
          </NavLink>
          <NavLink
            to="/posts/new"
            className={({ isActive }) =>
              isActive ? "nav-link" : "button button-primary button-small"
            }
          >
            Neuer Beitrag
          </NavLink>
        </nav>
      </div>
      <div
        className="progress"
        data-state={navigation.state}
        aria-hidden="true"
      />
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="inhalt" className="wrap page">
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
        ? "Diese Haltestelle gibt es nicht."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <Header />
      <main id="inhalt" className="wrap error-page">
        <h1 className="error-code">{message}</h1>
        <p className="error-text">{details}</p>
        <p className="error-actions">
          <Link to="/" className="button button-primary">
            Zurück zur Übersicht
          </Link>
        </p>
        {stack && (
          <pre className="error-stack">
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </>
  );
}
