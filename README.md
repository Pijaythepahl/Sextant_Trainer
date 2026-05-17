# Handsextant MVP

Version 0.53

Eine mobile WebApp, die einen Sextanten als Messinstrument simuliert. Die App berechnet keine Position, kann die Blickrichtung aber auf iPhone und iPad optional ueber die Orientierungssensoren steuern.

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
- 57 klassische Navigationssterne plus Polaris im Almanach fuehren
- Planetenpositionen geozentrisch korrekt aus heliocentrischen Bahnelementen ableiten
- Sonnen- und Mondscheibe in der Sextantenansicht passend zu Unterrand/Oberrand skalieren

## Version 0.5

- Layouts fuer Browser/Desktop, iPhone und iPad etablieren
- grosse Browserfenster nutzen die verfuegbare Breite mit zweispaltiger Bedienung
- iPhone-Ansicht bleibt kompakt und touchfreundlich
- iPad-Ansicht kombiniert grosses Instrument mit seitlicher Bedienung
- Blicksteuerung zwischen Reglern und Bewegungssteuerung umschalten
- Bewegungssteuerung mit iOS-Berechtigungsabfrage, Nullpunkt und geglaetteter Anzeige
- Regler bleiben als Fallback erhalten, wenn Sensoren fehlen oder nicht erlaubt werden

## Version 0.51

- grosse Alhidade- und Mikrometer-Regler direkt unter der Sextantenansicht ergaenzen
- Alhidade und Mikrometer mit Touch, Maus und Tastatur stufenlos bedienbar machen
- Blickregler im Bewegungsmodus ausblenden
- bestehende horizontale Regler fuer Alhidade und Mikrometer als Fallback erhalten

## Version 0.52

- grosse Alhidade- und Mikrometer-Regler im Bewegungsmodus als relative Plus/Minus-Flaechen bedienen
- Neuansetzen mit dem Finger springt nicht mehr auf den beruehrten Wert
- alte Blick-, Alhidade- und Mikrometer-Slider im Bewegungsmodus ausblenden
- iPad-Layout auf grosse Ansicht oben und Bedienung darunter umstellen

## Version 0.53

- Messung speichern im Bewegungsmodus direkt unter den grossen Reglern anbieten
- bestehenden Speichermechanismus fuer beide Speicherbuttons verwenden
- Gestirnliste stabil nach Sonne, Mond, Planeten und Sternen gruppieren
- Gestirne innerhalb der Gruppen alphabetisch sortieren
- echter Horizont in der Spiegelhaelfte als Referenz sichtbar halten
- verschobenen Spiegelhorizont fuer Indexfehler transparent darstellen

## GitHub Pages

Die App besteht nur aus statischen Dateien:

- `index.html`
- `styles.css`
- `app.js`

Hinweis: Die Standortuebernahme per Browser funktioniert auf iPadOS nur in einem sicheren Kontext, also zum Beispiel ueber GitHub Pages mit HTTPS. Wenn auf GitHub Pages trotzdem keine Nachfrage erscheint, ist Standortzugriff meist global oder fuer Safari-Websites deaktiviert. Pruefe auf dem iPad die Ortungsdienste und die Safari-Website-Einstellung fuer Standort.

Die Bewegungssteuerung braucht ebenfalls einen sicheren Kontext. Auf iPhone und iPad muss sie nach einem Fingertipp explizit erlaubt und danach mit dem Nullpunkt kalibriert werden.

Damit kann sie direkt aus einem GitHub-Repository per GitHub Pages veröffentlicht werden. Als Pages-Quelle reicht der Branch mit diesen Dateien im Root-Verzeichnis.
