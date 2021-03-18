SELECT p.name as partei, count(ab.kandidat_id) as gesamtsitze, t.anzahl_direktmandaten, t.anzahl_ueberhangsmandate
FROM ueberhangmandate t, parteien p, abgeordneten ab, kandidaten k
WHERE p.id = t.partei_id AND
ab.landtagswahl = $1 AND
t.landtagswahl = $1 AND
ab.wahlkreis_id = t.wahlkreis_id AND
k.partei_id = p.id AND
k.id = ab.kandidat_id AND
t.wahlkreis_id = $2
GROUP BY p.name, t.anzahl_direktmandaten, t.anzahl_ueberhangsmandate
ORDER BY count(ab.kandidat_id) desc