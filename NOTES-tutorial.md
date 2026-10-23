# Notizen zum Tutorial

Grundlage war das offizielle Tutorial auf reactrouter.com (Framework Mode, "Address Book"). Ich habe es Schritt für Schritt durchgearbeitet und jeweils auf den Blog übertragen.

## Was gut war

- Der Einstieg mit `npx create-react-router@latest` funktioniert sofort, Vite, TypeScript und Tailwind sind schon eingerichtet.
- Das Tutorial erklärt die wichtigsten Konzepte in einer sinnvollen Reihenfolge: Routen in `routes.ts`, `loader`, `action`, `<Form>`, `redirect`, `useNavigation` für Pending UI.
- Die generierten Typen (`./+types/...`) sind sehr praktisch. `loaderData` und `actionData` sind automatisch typisiert, ohne dass man selber Interfaces schreiben muss.
- Formulare funktionieren auch ohne JavaScript im Browser. Ich habe das mit curl getestet, der POST auf `/posts/new` gibt direkt einen Redirect zurück.
- Das Template enthält schon ein Dockerfile, das hat beim Deployment Zeit gespart.

## Wo es Lücken hatte

- Es gibt kein Blog-Beispiel. Das Tutorial baut ein Adressbuch, ich musste die Schritte selber auf Beiträge übertragen. Das alte Remix-Blog-Tutorial gibt es für v7 nicht mehr.
- Die Daten sind im Tutorial nur Fake-Daten im Speicher. Wie man eine echte Datenbank anbindet, wird nicht gezeigt. Für SQLite musste ich selber herausfinden, dass man die Datei mit `.server.ts` benennen sollte, damit sie nicht im Client-Bundle landet.
- Validierung von Formularen wird nur kurz angeschnitten. Fehlermeldungen über `actionData` zurückgeben habe ich aus einem anderen Teil der Doku (Form Validation) zusammengesucht.
- Deployment wird nur über die Templates erklärt. Dass `better-sqlite3` im Docker-Image ohne Python und g++ nicht baut, steht nirgends, das war Trial and Error.
- Beim Erstellen mit `create-react-router@latest` bekommt man inzwischen React Router v8. Für v7 muss man `create-react-router@7` verwenden, das steht im Tutorial nicht. Die v8-Version verlangt ausserdem mindestens Node 22.22.
- Die Doku hat drei Modi (Framework, Data, Declarative). Am Anfang ist nicht ganz klar, welche Seiten für welchen Modus gelten.

## Zeitaufwand

- Setup und Tutorial durchlesen: ca. 1 Lektion
- Blog umsetzen (Liste, Detail, Formular, DB): ca. 1 Lektion
- Docker und Deployment: siehe README
