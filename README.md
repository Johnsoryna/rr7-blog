# RR7 Blog

Ein kleiner Blog mit React Router 7 und SQLite. Ich habe ihn für Modul 245, Aufgabe 7 (React-Frameworks vergleichen und bewerten) gebaut. Meine Card war Remix / React Router 7.

## Abgabe

| | |
| --- | --- |
| Repository | https://github.com/Johnsoryna/rr7-blog |
| Deployte App | https://v2202511310846397435.powersrv.de |
| Tutorial-Notizen | [NOTES-tutorial.md](NOTES-tutorial.md) |
| Lighthouse-Reports | [docs/lighthouse/](docs/lighthouse/) |

Checkliste:

- [x] Card gelesen und Framework-Features dokumentiert
- [x] Blog gemäss Tutorial erstellt und lokal gestartet
- [x] Projekt mit Git verwaltet
- [x] Deployment auf IaaS durchgeführt
- [x] Lighthouse-Messung durchgeführt und Werte notiert
- [x] Alle vier Matrizen ausgefüllt
- [x] Projekt-Anforderungen und Takeaways aufgeschrieben

## Der Blog

Auf der Startseite stehen alle Beiträge, neuste zuerst. Ein Klick öffnet die Detailansicht. Unter "Neuer Beitrag" gibt es ein Formular mit Titel und Text, das die Eingaben auf dem Server prüft und danach auf den neuen Beitrag weiterleitet. Das Formular funktioniert auch, wenn im Browser JavaScript ausgeschaltet ist.

Lokal starten (Node 20 oder neuer):

```
git clone https://github.com/Johnsoryna/rr7-blog.git
cd rr7-blog
npm install
npm run dev
```

Danach läuft der Blog auf http://localhost:5173. Die Datenbank `data/blog.db` wird beim ersten Start angelegt und bekommt zwei Beispielbeiträge.

Weitere Befehle:

| Befehl | Was er macht |
| --- | --- |
| `npm run build` und `npm start` | Produktionsbuild bauen und auf Port 3000 starten |
| `npm run typecheck` | Typen generieren und mit TypeScript prüfen |
| `docker compose up -d --build` | Blog im Container starten, Daten auf einem Volume |

Wichtige Dateien:

| Datei | Inhalt |
| --- | --- |
| `app/routes.ts` | Routen-Konfiguration |
| `app/routes/home.tsx` | Liste aller Beiträge (`loader`) |
| `app/routes/posts.$postId.tsx` | Detailansicht, 404 wenn es die ID nicht gibt |
| `app/routes/posts.new.tsx` | Formular mit `action`, Validierung, Spam-Schutz und Redirect |
| `app/lib/db.server.ts` | SQLite-Verbindung, Tabelle und Startdaten |
| `app/lib/posts.server.ts` | Beiträge lesen und speichern |
| `app/lib/rate-limit.server.ts` | Limit für neue Beiträge pro IP |
| `Dockerfile`, `docker-compose.yml` | Container für den Blog |
| `docker-compose.prod.yml`, `Caddyfile` | Caddy als Reverse Proxy mit HTTPS auf dem Server |

Ich verwende `react-router` 7.18.4. Mit `create-react-router@latest` bekommt man inzwischen schon v8. Weil die Card v7 behandelt, habe ich das Projekt mit `create-react-router@7` erstellt.

## React Router 7 (Card)

React Router gibt es seit 2014, es war lange einfach der Router für React. Remix kam 2021 als Full-Stack-Framework dazu und war von Anfang an auf React Router aufgebaut. Im Mai 2024 hat das Team beides zusammengelegt: Was als Remix v3 geplant war, erschien im November 2024 als React Router v7. Wer heute Remix mit React meint, arbeitet also mit React Router 7 oder 8.

Man kann React Router in drei Modi verwenden. Im Declarative Mode macht es nur Routing im Browser, so wie früher mit `<BrowserRouter>`. Im Data Mode definiert man Routen als Objekte mit `loader` und `action`, aber ohne eigenes Build-Tool. Der Framework Mode ist das frühere Remix, mit Vite-Plugin, Routen in `routes.ts`, Server-Side Rendering und generierten Typen. Für den Blog habe ich den Framework Mode genommen.

Was ich im Framework Mode verwendet habe:

- `loader` lädt die Daten auf dem Server, bevor die Seite gerendert wird.
- `action` verarbeitet das Formular auf dem Server. `<Form>` schickt einen normalen POST, darum geht es auch ohne JavaScript.
- `useNavigation` zeigt an, ob gerade geladen oder gespeichert wird. Ich nutze es für den blauen Ladebalken und den Button "Wird gespeichert...".
- Dateien mit `.server.ts` landen nie im Client-Bundle. Darum liegt der Datenbankzugriff in `db.server.ts`.
- Das Rendering lässt sich pro Projekt einstellen: SSR (Standard), SPA-Modus (`ssr: false`) oder statisches Pre-Rendering (`prerender`).

Seit Oktober 2026 gibt es Remix 3 (`remix@3.0.0`). Das ist ein neues Framework, das nicht mehr auf React aufbaut. Für React-Projekte bleibt React Router der Weg, der Name Remix führt da inzwischen eher in die Irre.

## Ecosystem-Summary

React Router ist eines der ältesten und meistgenutzten Pakete im React-Umfeld. Bei den Downloads liegt es knapp hinter Next.js. Die Zahl ist aber geschönt, weil viele Projekte React Router nur als Client-Router nutzen. Wie viele den Framework Mode verwenden, zeigt eher `@react-router/dev` mit ca. 1.5 Mio. Downloads pro Woche. Hinter dem Projekt steht Shopify, das Remix 2022 gekauft hat und es selbst für den Admin-Bereich einsetzt. Seit Juni 2025 hat das Projekt eine offene Governance.

Releases gibt es oft: 19 stabile Versionen zwischen April und Oktober 2026, und v7 bekommt auch nach dem Erscheinen von v8 noch Sicherheits-Patches. Was mich gestört hat, sind die vielen Namenswechsel. Remix v2 wurde zu React Router v7, ein Jahr später kam v8, und daneben gibt es jetzt Remix 3 ohne React. Bei der Suche nach Lösungen bin ich oft auf Beiträge für Remix v2 gestossen, die nicht mehr ganz stimmen.

## Matrizen

Die Werte habe ich am 23.10.2026 erhoben. Die anderen Frameworks bearbeiten andere Personen, darum steht hier nur meine Zeile.

### Ecosystem

| Name | Age | Usage | Documentation | Issue & Bug Fixes | Migration |
| --- | --- | --- | --- | --- | --- |
| Remix / React Router 7 | React Router seit 2014, Remix seit 2021, v7 seit 22.11.2024 | `react-router` 33.1 Mio. Downloads pro Woche, `@react-router/dev` 1.5 Mio., 56.6k GitHub-Stars | Gut für die Grundlagen. Das Tutorial baut aber ein Adressbuch statt eines Blogs und zeigt keine echte Datenbank (siehe `NOTES-tutorial.md`) | 122 offene Issues, 117 offene PRs, 19 Releases in 6 Monaten, v7 bekommt noch Patches | Remix v2 → v7 mit Future Flags und Codemod, v6 → v7 ohne Breaking Changes (mit Future Flags), v7 → v8 braucht Node 22.22 und React 19.2 |

### Performance

Gemessen mit Lighthouse 13.5 auf der deployten URL, für die Liste `/` und die Detailseite `/posts/1`. Die Werte stehen in der Reihenfolge Performance / Accessibility / Best Practices / SEO.

| Seite | Mobile | Desktop | LCP Mobile | TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| Liste | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.4 s | 0 ms | 0 |
| Detail | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.4 s | 0 ms | 0 |

Lighthouse lief in einem Chromium-Container auf dem Server selbst. Aus dem Schulnetz ging es nicht, weil die Firewall die erste Adresse gesperrt hat (mehr dazu unter Deployment). Lighthouse simuliert ein langsames Netz, die Werte sind also vergleichbar. Die echte Distanz zum Server fehlt aber. Lokal mit Docker kam ich auf Mobile 98 und Desktop 100.

| Name | Server-Side Rendering | Single Page App | Static Generation | Serverless Affinity |
| --- | --- | --- | --- | --- |
| Remix / React Router 7 | Ja, Standard (`ssr: true`) mit Streaming | Ja, mit `ssr: false` | Ja, mit `prerender` pro Route oder für alles | Gut: Adapter für Node, Express, Cloudflare Workers und AWS. Vercel und Netlify haben eigene Vorlagen |

### Business Models & Pricing

| Name | Infrastruktur-Kosten | Lizenz-Kosten | Avg. Starter-Plan / Monat | Kosten kleine App | Kosten grosse App |
| --- | --- | --- | --- | --- | --- |
| Remix / React Router 7 | Läuft überall, wo Node läuft: eigener Server, Container, Serverless oder Edge | Keine (MIT) | ca. 5–20 USD (Cloudflare 5 USD, Hetzner CX23 6 EUR, Vercel/Netlify Pro 20 USD) | 0–11 CHF: ein kleiner VPS reicht, Gratis-Pläne gehen auch | Geschätzt 50–300 USD: mehrere Instanzen, Load Balancer, Postgres statt SQLite, oder Vercel Pro mit Nutzungskosten |

Preise der Anbieter am 23.10.2026: Vercel Hobby gratis (nur privat), Pro 20 USD pro Person. Netlify Free gratis, Pro 20 USD. Cloudflare Workers Paid 5 USD. Fly.io ab ca. 2 USD, Hetzner CX23 5.99 EUR, DigitalOcean ab 4 USD.

### Scalability

| Name | Horizontal Scaling | Host Provider Headroom | Additional Notes |
| --- | --- | --- | --- |
| Remix / React Router 7 | Gut: Der Server speichert selbst keinen Zustand, mehrere Instanzen hinter einem Load Balancer sind möglich | Gross: Node-Server, Docker, Serverless und Edge (Cloudflare) | Mein Blog läuft wegen SQLite nur auf einer Instanz. Für mehrere Instanzen müsste die Datenbank zu Postgres o. ä. wechseln. Shopify nutzt Remix für den Admin mit 67 Mio. Seitenaufrufen pro Tag |

## Deployment

Der Blog läuft auf meinem eigenen VPS bei netcup (IaaS, Ubuntu 24.04, 4 vCPU, 8 GB RAM) mit Docker Compose. Davor sitzt Caddy als Reverse Proxy und kümmert sich um HTTPS.

| | Wert |
| --- | --- |
| Build-Zeit lokal (Windows, Docker Desktop) | ca. 80 s |
| Build-Zeit Server | ca. 26 s |
| Image-Grösse | 420 MB |
| Aufwand | ca. 30 Minuten, dazu das Zertifikat-Problem weiter unten |
| Kosten | 11 CHF pro Monat für den VPS, der auch für andere Projekte läuft. Lizenz und Zertifikat sind gratis |

Auf dem Server:

```
git clone https://github.com/Johnsoryna/rr7-blog.git
cd rr7-blog
echo "ACME_EMAIL=meine@mail.ch" > .env
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Für ein Update reichen `git pull` und derselbe `docker compose`-Befehl. Hat sich das `Caddyfile` geändert, muss Caddy neu starten (`docker compose ... restart caddy`), weil der Container sonst noch die alte Datei sieht.

Was nicht auf Anhieb geklappt hat:

- `better-sqlite3` ist ein natives Modul und brauchte im Docker-Image Python, make und g++. Der erste Build ist deshalb fehlgeschlagen. Die Build-Tools sind jetzt nur in den Build-Stages, im fertigen Image fehlen sie.
- Ich habe keine eigene Domain. Zuerst lief der Blog über sslip.io (`rr7-blog.152-53-135-86.sslip.io`), das die IP-Adresse direkt im Hostnamen auflöst. Die Fortinet-Firewall im Schulnetz sperrt aber alle solchen Gratis-DNS-Dienste und setzt ihr eigenes Zertifikat ein. Der Browser hat deshalb "unsicher" angezeigt, obwohl das Zertifikat in Ordnung war. Jetzt verwende ich den Hostnamen, den netcup dem Server automatisch gibt (`v2202511310846397435.powersrv.de`). Den lässt die Firewall durch.
- Für diesen Hostnamen hat Let's Encrypt kein Zertifikat ausgestellt. Alle netcup-Kunden teilen sich das Limit von 50 Zertifikaten pro Woche für `powersrv.de`, und das war erreicht. Mit einer E-Mail-Adresse in `.env` weicht Caddy auf ZeroSSL aus. Von dort kommt das aktuelle Zertifikat, gültig bis 21.01.2027. Caddy verlängert es selbst.

Sicherheit:

- Das Formular hat ein unsichtbares Honeypot-Feld gegen Bots und nimmt höchstens 5 Beiträge pro IP in 10 Minuten an. Der Titel darf 120 Zeichen lang sein, der Text 10'000.
- Caddy lehnt Anfragen über 64 KB ab und setzt Security-Header (HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Die Header `Server` und `Via` entfernt es.
- Der Blog-Container läuft als Benutzer `node`, das Dateisystem ist bis auf `/data` nur lesbar, dazu `no-new-privileges`, keine Linux-Capabilities und 512 MB Speicherlimit.
- Auf dem Server geht SSH nur mit Schlüssel, dazu laufen fail2ban, ufw und automatische Sicherheitsupdates.

## Anforderungen unseres Projekts

Das Projekt ist hier der Blog selbst.

Business Needs:

- Kostenrahmen: keine zusätzlichen Kosten. Der Blog soll auf meinem bestehenden VPS (11 CHF pro Monat) laufen.
- Teamgrösse: 1 Person. Ich bearbeite die Card React Router 7, die anderen Frameworks machen andere.
- Zeit: ca. 6 Lektionen (Woche 8), davon ca. 2 Lektionen für den Blog selbst.
- Vorwissen: React-Grundlagen, Git und Docker kannte ich schon. Node auf dem Server und React Router im Framework Mode waren neu.

Scalability Needs:

- Nutzer: Lehrperson und Klasse, also weniger als 50 Besucher. Wachstum ist keines geplant.
- Kein Login, keine Echtzeit, wenig Schreibzugriffe (ab und zu ein neuer Beitrag).
- Ein Server in Europa reicht, Edge-Hosting braucht es nicht.

Vergleich mit den Matrizen:

- Kosten: Die Lizenz ist gratis (MIT) und der Server war schon da. Vercel Hobby wäre auch gratis gewesen, dort hätte ich für die Beiträge aber eine externe Datenbank gebraucht.
- Zeit: Mit dem offiziellen Tutorial war der Blog in ca. 2 Lektionen fertig. Das Deployment mit Docker und Caddy hat ca. 30 Minuten gedauert, das Zertifikat im Schulnetz hat mich dann aber länger beschäftigt als der ganze Code.
- Skalierung: Für unter 50 Besucher reicht eine Instanz mit SQLite locker, Lighthouse zeigt überall 100. Erst bei echtem Wachstum müsste ich auf Postgres und mehrere Instanzen wechseln. Am Framework selbst müsste ich dafür nichts umbauen.

Mein Fazit: React Router 7 erfüllt alle Anforderungen. Für einen Blog ganz ohne Formular wäre ein statisches Framework wie Astro wahrscheinlich einfacher. Sobald man Daten auf dem Server speichern will, passt React Router aber gut, vor allem wenn man schon React kann und nicht an einen bestimmten Anbieter gebunden sein will.

## Erkenntnisse

- Den meisten Aufwand hatte ich nicht beim Code, sondern bei Datenbank, Deployment und Zertifikat. Wie gut ein Framework passt, hängt deshalb stark vom Hosting ab.
- React Router 7 arbeitet nah an Web-Standards wie Formularen, Request und Response. Darum geht der Blog sogar ohne JavaScript, und ich habe gut verstanden, was auf dem Server passiert.
- Die schnellen Versionswechsel sind ein echtes Risiko. Remix → RR7 → RR8 in zwei Jahren, dazu Remix 3 ohne React: Mit einem grösseren Upgrade pro Jahr muss man rechnen.
- Ein eigener Server ist günstig und flexibel. Updates, HTTPS und Backups muss ich dann aber selbst machen. Bei einer PaaS bezahlt man genau diese Arbeit mit.
- 100 Punkte in Lighthouse sind bei so einer kleinen App leicht zu erreichen. Fair vergleichen kann man die Frameworks nur mit der gleichen App auf dem gleichen Hosting.
- SQLite ist für ein Schulprojekt ideal, verhindert aber horizontales Skalieren. Für die Skalierbarkeit zählt die Datenbank mehr als das Framework.

## Quellen

- https://reactrouter.com (Tutorial, Deploying, Pre-Rendering, SPA Mode, Upgrading)
- https://remix.run/blog/merging-remix-and-react-router
- https://github.com/remix-run/react-router/blob/main/CHANGELOG.md
- https://api.npmjs.org/downloads (Downloads 12.–18.10.2026)
- https://npmtrends.com/react-router-vs-next-vs-@react-router/dev
- https://vercel.com/pricing, https://www.netlify.com/pricing/, https://developers.cloudflare.com/workers/platform/pricing/, https://www.hetzner.com/cloud/, https://www.digitalocean.com/pricing/droplets
- https://shopify.engineering/remixing-admin
