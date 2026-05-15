# Handsextant MVP

Eine mobile WebApp, die einen Sextanten als Messinstrument simuliert. Die App berechnet keine Position und nutzt im ersten MVP keine Handy-Sensoren.

## MVP 1

- Blickrichtung horizontal und vertikal manuell steuern
- simulierte Sonne im Himmel suchen
- reflektiertes Sonnenbild mit Indexarm und Schnecke auf den Horizont bringen
- Sextantenablesung als `Hs` anzeigen
- Indexfehler in Minuten einstellen
- korrigierte Ablesung anzeigen
- Messungen mit Zeitstempel speichern

## MVP 2

- Latitude und Longitude manuell in Grad und Dezimalminuten eingeben
- UTC-Zeit setzen oder auf den aktuellen Zeitpunkt springen
- vereinfachten Almanach fuer Sonne, Mond, sichtbare Planeten und Navigationssterne berechnen
- Gestirn aus einer Liste auswaehlen, fuer Sonne und Mond mit Oberrand und Unterrand
- Blick grob auf das gewaehlte Gestirn ausrichten
- Messprotokoll mit Ort, Zeit, Zielhoehe und Zielazimut speichern

Der Almanach ist fuer den Simulator gedacht und ersetzt keinen amtlichen Nautical Almanac.

## GitHub Pages

Die App besteht nur aus statischen Dateien:

- `index.html`
- `styles.css`
- `app.js`

Damit kann sie direkt aus einem GitHub-Repository per GitHub Pages veröffentlicht werden. Als Pages-Quelle reicht der Branch mit diesen Dateien im Root-Verzeichnis.
