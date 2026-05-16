# Handsextant MVP

Version 0.42

Eine mobile WebApp, die einen Sextanten als Messinstrument simuliert. Die App berechnet keine Position und nutzt im ersten MVP keine Handy-Sensoren.

## MVP 1

- Blickrichtung horizontal und vertikal manuell steuern
- simulierte Sonne im Himmel suchen
- reflektiertes Sonnenbild mit Indexarm und Schnecke auf den Horizont bringen
- Sextantenablesung als `Hs` anzeigen
- Indexfehler in Minuten einstellen
- Indexfehler als Rechenwert fuer eigene Korrektur erfassen
- Messungen mit Zeitstempel speichern

## MVP 2

- Latitude und Longitude manuell in Grad und Dezimalminuten eingeben
- UTC-Zeit setzen oder auf den aktuellen Zeitpunkt springen
- vereinfachten Almanach fuer Sonne, Mond, sichtbare Planeten und Navigationssterne berechnen
- Gestirn aus einer Liste auswaehlen, fuer Sonne und Mond mit Oberrand und Unterrand
- Blick grob auf das gewaehlte Gestirn ausrichten
- Messprotokoll mit Ort, Zeit, Zielhoehe und Zielazimut speichern

Der Almanach ist fuer den Simulator gedacht und ersetzt keinen amtlichen Nautical Almanac.

## MVP 3

- genauere Sonnenposition mit scheinbarer Ekliptiklaenge und wahrer Schiefe berechnen
- Mondposition mit zusaetzlichen Stoerungstermen und topozentrischer Parallaxe verbessern
- scheinbare Hoehen inklusive atmosphaerischer Refraktion fuer die Anzeige verwenden
- Sextantenansicht bei vertikaler Blickaenderung ueber der Realansicht mitbewegen
- Beobachterhoehe mit Kimmtiefe in Darstellung und Messprotokoll beruecksichtigen

## MVP 4

- Almanach im Live-UTC-Modus jede Sekunde aktualisieren
- Gestirne bewegen sich dadurch in Realansicht und Sextantenansicht automatisch weiter
- UTC-Zeit weiterhin manuell setzen; manuelle Eingabe schaltet den Live-Modus aus
- Browser-Standort in Latitude und Longitude uebernehmen
- manuelle Standort-Eingabe bleibt erhalten

## GitHub Pages

Die App besteht nur aus statischen Dateien:

- `index.html`
- `styles.css`
- `app.js`

Hinweis: Die Standortuebernahme per Browser funktioniert auf iPadOS nur in einem sicheren Kontext, also zum Beispiel ueber GitHub Pages mit HTTPS. Wenn auf GitHub Pages trotzdem keine Nachfrage erscheint, ist Standortzugriff meist global oder fuer Safari-Websites deaktiviert. Pruefe auf dem iPad die Ortungsdienste und die Safari-Website-Einstellung fuer Standort.

Damit kann sie direkt aus einem GitHub-Repository per GitHub Pages veröffentlicht werden. Als Pages-Quelle reicht der Branch mit diesen Dateien im Root-Verzeichnis.
