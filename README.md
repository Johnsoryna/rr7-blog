# RR7 Blog – Remix / React Router v7

Modul 245, Aufgabe 7: React-Frameworks vergleichen und bewerten. Meine Card: **Remix / React Router 7**.

- Repository: https://github.com/Johnsoryna/rr7-blog
- Deployte App: https://v2202511310846397435.powersrv.de

Der Blog kann alle Beiträge auflisten, einen Beitrag im Detail anzeigen und über ein Formular neue Beiträge anlegen. Die Daten liegen in einer SQLite-Datenbank.

## Lokal starten

```
npm install
npm run dev
```

Produktionsbuild:

```
npm run build
npm start
```

Mit Docker:

```
docker compose up -d --build
```

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `app/routes.ts` | Routen-Konfiguration |
| `app/routes/home.tsx` | Liste aller Beiträge (`loader`) |
| `app/routes/posts.$postId.tsx` | Detailansicht, 404 wenn es die ID nicht gibt |
| `app/routes/posts.new.tsx` | Formular mit `action`, Validierung und Redirect |
| `app/lib/db.server.ts` | SQLite-Verbindung, Tabelle und Startdaten |
| `app/lib/posts.server.ts` | Funktionen zum Lesen und Speichern |
| `Dockerfile`, `docker-compose.yml` | Container für die App |
| `docker-compose.prod.yml`, `Caddyfile` | Reverse Proxy mit HTTPS auf dem Server |

Verwendete Version: `react-router` 7.18.4. Mit `create-react-router@latest` bekommt man inzwischen v8. Weil die Card v7 behandelt, habe ich das Projekt mit `create-react-router@7` erstellt.

## Features von React Router 7 (Card)

React Router ist seit 2014 der Standard-Router für React. Remix war ein Full-Stack-Framework, das auf React Router aufgebaut hat. Im Mai 2024 hat das Team entschieden, beides zusammenzulegen: Was als Remix v3 geplant war, kam im November 2024 als React Router v7 heraus. Wer heute "Remix" mit React meint, verwendet also React Router 7 bzw. 8.

React Router kann in drei Modi verwendet werden:

- **Declarative Mode**: nur Routing im Browser, wie früher mit `<BrowserRouter>`.
- **Data Mode**: Routen als Objekte mit `loader` und `action`, aber ohne eigenes Build-Tool.
- **Framework Mode**: das frühere Remix. Vite-Plugin, Routen in `routes.ts`, Server-Side Rendering, Code-Splitting und generierte Typen. Diesen Modus habe ich für den Blog verwendet.

Wichtige Konzepte im Framework Mode:

- `loader`: lädt Daten auf dem Server, bevor die Seite gerendert wird.
- `action`: verarbeitet Formulare auf dem Server. `<Form>` funktioniert auch ohne JavaScript im Browser (Progressive Enhancement).
- `useNavigation`: zeigt an, ob gerade geladen oder gespeichert wird (Pending UI).
- Dateien mit `.server.ts` werden nie ins Client-Bundle übernommen. Darum liegt die Datenbank in `db.server.ts`.
- Rendering ist pro Projekt einstellbar: SSR (Standard), SPA-Modus (`ssr: false`) oder statisches Pre-Rendering (`prerender`).

Zu Remix selbst: Seit Oktober 2026 gibt es Remix 3 (`remix@3.0.0`). Das ist aber ein komplett neues Framework, das nicht mehr auf React aufbaut. Für React-Projekte bleibt React Router der Weg.

## Ecosystem-Summary

React Router ist eines der ältesten und meistgenutzten Pakete im React-Ökosystem, knapp hinter Next.js bei den Downloads. Die vielen Downloads kommen aber auch daher, dass viele Projekte React Router nur als Client-Router nutzen. Den Framework Mode zeigt eher `@react-router/dev` mit ca. 1.5 Mio. Downloads pro Woche. Hinter dem Projekt steht Shopify (Remix wurde 2022 übernommen), Shopify nutzt es selbst für den Admin-Bereich. Seit Juni 2025 hat das Projekt eine offene Governance.

Es gibt viele Releases. Seit April 2026 kamen 19 stabile Versionen heraus, und v7 bekommt auch nach dem Release von v8 noch Sicherheits-Patches. Negativ ist, dass sich die Namen und Pakete in den letzten Jahren oft geändert haben (Remix v2 → React Router v7 → v8 im Jahresrhythmus, dazu Remix 3 ohne React). Das macht die Suche nach Antworten im Internet manchmal verwirrend, weil viele Beiträge noch für Remix v2 geschrieben sind.

## Matrizen

Werte erhoben am 23.10.2026. Die Zeilen der anderen Frameworks füllt die Gruppe aus.

### Ecosystem

| Name | Age | Usage | Documentation | Issue & Bug Fixes | Migration |
| --- | --- | --- | --- | --- | --- |
| Remix / React Router 7 | React Router seit 2014, Remix seit 2021, v7 seit 22.11.2024 | `react-router` 33.1 Mio. Downloads/Woche, `@react-router/dev` 1.5 Mio., 56.6k GitHub-Stars | Gut für die Grundlagen, Tutorial baut aber ein Adressbuch statt eines Blogs, keine echte DB im Tutorial (siehe `NOTES-tutorial.md`) | 122 offene Issues, 117 offene PRs, 19 Releases in 6 Monaten, v7 bekommt noch Patches | Remix v2 → v7 mit Future Flags und Codemod, v6 → v7 ohne Breaking Changes (mit Future Flags), v7 → v8 braucht Node 22.22 und React 19.2 |
| create-react-app | | | | | |
| Next.js | | | | | |
| Gatsby | | | | | |
| Blitz | | | | | |
| Redwood | | | | | |
| Astro | | | | | |

### Performance

Lighthouse 13.5, gemessen auf der deployten URL (Liste `/` und Detail `/posts/1`), Reports in `docs/lighthouse/`. Reihenfolge der Werte: Performance / Accessibility / Best Practices / SEO.

| Seite | Mobile | Desktop | LCP Mobile | TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| Liste | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.4 s | 0 ms | 0 |
| Detail | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.4 s | 0 ms | 0 |

Die Messung lief in einem Chromium-Container auf dem gleichen Server, weil das Schulnetz die erste Adresse (sslip.io) blockiert hat. Lighthouse drosselt das Netzwerk dabei simuliert, die Werte sind also vergleichbar, aber die echte Distanz zum Server fehlt. Lokal mit Docker kam ich auf Mobile 98 und Desktop 100.

| Name | Server-Side Rendering | Single Page App | Static Generation | Serverless Affinity |
| --- | --- | --- | --- | --- |
| Remix / React Router 7 | Ja, Standard (`ssr: true`) mit Streaming | Ja, mit `ssr: false` | Ja, mit `prerender` pro Route oder komplett | Gut: Adapter für Node, Express, Cloudflare Workers und AWS, Vercel und Netlify bieten eigene Vorlagen |
| create-react-app | | | | |
| Next.js | | | | |
| Gatsby | | | | |
| Blitz | | | | |
| Redwood | | | | |
| Astro | | | | |

### Business Models & Pricing

| Name | Infrastruktur-Kosten | Lizenz-Kosten | Avg. Starter-Plan / Monat | Kosten kleine App | Kosten grosse App |
| --- | --- | --- | --- | --- | --- |
| Remix / React Router 7 | Läuft überall, wo Node läuft: eigener Server, Container, Serverless oder Edge | Keine (MIT) | ca. 5–20 USD (Cloudflare 5, Hetzner CX23 6 EUR, Vercel/Netlify Pro 20) | 0–6 EUR: ein kleiner VPS reicht, Gratis-Pläne möglich | Schätzung 50–300 USD: mehrere Instanzen, Load Balancer, Postgres statt SQLite, oder Vercel Pro mit Nutzungskosten |
| create-react-app | | | | | |
| Next.js | | | | | |
| Gatsby | | | | | |
| Blitz | | | | | |
| Redwood | | | | | |
| Astro | | | | | |

Preise der Anbieter am 23.10.2026: Vercel Hobby gratis (nur privat), Pro 20 USD pro Person; Netlify Free gratis, Pro 20 USD; Cloudflare Workers Paid 5 USD; Fly.io ab ca. 2 USD; Hetzner CX23 5.99 EUR; DigitalOcean ab 4 USD.

### Scalability

| Name | Horizontal Scaling | Host Provider Headroom | Additional Notes |
| --- | --- | --- | --- |
| Remix / React Router 7 | Gut: der Server speichert selbst keinen Zustand, mehrere Instanzen hinter einem Load Balancer sind möglich | Gross: Node-Server, Docker, Serverless und Edge (Cloudflare) | Mein Blog skaliert wegen SQLite nur auf einer Instanz. Für mehrere Instanzen müsste die DB zu Postgres o. ä. wechseln. Shopify nutzt Remix für den Admin (67 Mio. Seitenaufrufe pro Tag) |
| create-react-app | | | |
| Next.js | | | |
| Gatsby | | | |
| Blitz | | | |
| Redwood | | | |
| Astro | | | |

## Deployment

Deployt auf meinem eigenen VPS (IaaS, Ubuntu 24.04, 4 vCPU, 8 GB RAM) mit Docker Compose. Caddy dient als Reverse Proxy und holt automatisch ein Let's-Encrypt-Zertifikat.

Ich habe keine eigene Domain. Zuerst lief die Seite über sslip.io (`rr7-blog.152-53-135-86.sslip.io`), das die IP-Adresse im Hostnamen auflöst. Im Schulnetz hat die Fortinet-Firewall diese Adresse aber gesperrt und ein eigenes Zertifikat eingesetzt, darum hat der Browser "unsicher" angezeigt. Gesperrt ist die ganze Kategorie der Gratis-DNS-Dienste (sslip.io, nip.io, duckdns.org), normale Domains gehen. Deshalb verwende ich jetzt den Hostnamen, den netcup dem Server automatisch gibt (`v2202511310846397435.powersrv.de`). Er hat ein eigenes Let's-Encrypt-Zertifikat und funktioniert auch im Schulnetz. Die alte Adresse funktioniert weiterhin.

Caddy setzt ausserdem Security-Header: HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy und Permissions-Policy. Die Header `Server` und `Via` werden entfernt.

Auf dem Server:

```
git clone https://github.com/Johnsoryna/rr7-blog.git
cd rr7-blog
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Update:

```
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

| | Wert |
| --- | --- |
| Build-Zeit lokal (Windows, Docker Desktop) | ca. 80 s |
| Build-Zeit Server | ca. 26 s |
| Image-Grösse | 420 MB |
| Kosten | Preis VPS pro Monat: _noch eintragen_ |

Aufwand und Probleme:

- `better-sqlite3` ist ein natives Modul. Im Docker-Image fehlten Python, make und g++, deshalb ist der erste Build fehlgeschlagen. Ich habe die Build-Tools nur in den Build-Stages installiert, im fertigen Image sind sie nicht drin.
- Die Datenbank liegt auf einem Docker-Volume (`/data`), damit Beiträge einen Neustart überleben. Das habe ich getestet.
- Caddy einzurichten ging schnell (vier Zeilen im `Caddyfile`). Das Zertifikat war nach wenigen Sekunden da.
- Gesamtaufwand für das Deployment: ca. 30 Minuten. Bei Vercel wäre es schneller gegangen, dafür hätte ich für SQLite eine externe Datenbank gebraucht.

## Anforderungen unseres Projekts

### Business Needs

- Kostenrahmen: _noch eintragen_
- Teamgrösse: _noch eintragen_
- Zeit bis zur ersten Version: _noch eintragen_
- Vorwissen im Team (React, Node, Docker): _noch eintragen_

### Scalability Needs

- Erwartete Anzahl Nutzer am Anfang und nach einem Jahr: _noch eintragen_
- Braucht es Login, Echtzeit oder viele Schreibzugriffe: _noch eintragen_
- Muss die App weltweit schnell sein (Edge) oder reicht ein Server: _noch eintragen_

### Vergleich mit den Matrizen

_Nach dem Ausfüllen der Anforderungen hier mit den Matrizen vergleichen._

React Router 7 passt gut, wenn das Projekt Formulare und Daten vom Server braucht, das Team schon React kann und die Kosten tief bleiben sollen, weil man nicht an einen Anbieter gebunden ist. Weniger passend ist es für eine reine statische Seite mit viel Inhalt (dafür wäre Astro einfacher) oder wenn man ein fertiges Komplettpaket mit Auth und Datenbank sucht.

## Erkenntnisse

- Ein Framework zu wählen hängt weniger vom Code ab als vom Hosting und den Kosten. Das Programmieren des Blogs ging schnell, mehr Zeit brauchten Datenbank und Deployment.
- React Router 7 ist nah an Web-Standards (Formulare, Request/Response). Dadurch funktioniert der Blog sogar ohne JavaScript, und man versteht gut, was auf dem Server passiert.
- Die schnellen Versionswechsel (Remix → RR7 → RR8, dazu Remix 3) sind ein Risiko. Man muss mit einem Upgrade pro Jahr rechnen.
- Ein eigener Server ist günstig und flexibel, man ist aber selbst für Updates, HTTPS und Backups zuständig. Bei einer PaaS bezahlt man diese Arbeit mit.
- Lighthouse-Werte von 100 sind bei so einer kleinen App einfach zu erreichen. Für einen fairen Vergleich müssten alle Frameworks die gleiche App auf dem gleichen Hosting haben.
- SQLite ist für ein Schulprojekt ideal, verhindert aber horizontales Skalieren. Die Datenbank ist für die Skalierbarkeit wichtiger als das Framework.

## Checkliste

- [x] Card gelesen und Framework-Features dokumentiert
- [x] Blog gemäss Tutorial erstellt und lokal gestartet
- [x] Projekt mit Git verwaltet
- [x] Deployment auf IaaS durchgeführt
- [x] Lighthouse-Messung durchgeführt und Werte notiert
- [x] Alle vier Matrizen ausgefüllt (Zeile React Router 7)
- [ ] Projekt-Anforderungen und Takeaways aufgeschrieben (Anforderungen noch ausfüllen)

## Quellen

- https://reactrouter.com (Tutorial, Deploying, Pre-Rendering, SPA Mode, Upgrading)
- https://remix.run/blog/merging-remix-and-react-router
- https://github.com/remix-run/react-router/blob/main/CHANGELOG.md
- https://api.npmjs.org/downloads (Downloads 12.–18.10.2026)
- https://npmtrends.com/react-router-vs-next-vs-@react-router/dev
- https://vercel.com/pricing, https://www.netlify.com/pricing/, https://developers.cloudflare.com/workers/platform/pricing/, https://www.hetzner.com/cloud/, https://www.digitalocean.com/pricing/droplets
- https://shopify.engineering/remixing-admin
