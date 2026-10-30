import { Link } from "react-router";

export const NOT_FOUND_TITLE = "Seite nicht gefunden | RR7 Blog";

export function NotFound() {
  return (
    <section className="error-page">
      <h1 className="error-code">404</h1>
      <p className="error-text">Diese Haltestelle gibt es nicht.</p>
      <p className="error-actions">
        <Link to="/" className="button button-primary">
          Zurück zur Übersicht
        </Link>
      </p>
    </section>
  );
}

export function RouteError({ status }: { status?: number }) {
  if (status === 404) {
    return <NotFound />;
  }
  return (
    <section className="error-page">
      <h1 className="error-code">Fehler</h1>
      <p className="error-text">Es ist ein unerwarteter Fehler aufgetreten.</p>
      <p className="error-actions">
        <Link to="/" className="button button-primary">
          Zurück zur Übersicht
        </Link>
      </p>
    </section>
  );
}
