SELECT  k.vorname, k.nachname, p.name as partei, ake.anzahl, round(ake.anzahl * 100.00 / (SELECT sum(anzahl)
                                                                                          FROM aggregat_kandidat_erststimmen ake
                                                                                          WHERE ake.landtagswahl = $1 AND
                                                                                          ake.stimmkreis_id = $2), 2)
                                                                                          as prozent
FROM aggregat_kandidat_erststimmen ake, kandidaten k, parteien p
WHERE k.id = ake.kandidat_id AND
k.partei_id = p.id AND
ake.landtagswahl = $1 AND
ake.stimmkreis_id = $2
ORDER BY ake.anzahl desc
LIMIT 5