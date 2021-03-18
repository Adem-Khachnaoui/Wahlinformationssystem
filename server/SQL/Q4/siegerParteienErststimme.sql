SELECT  p.name as partei, ake.anzahl, round(ake.anzahl * 100.00 / (SELECT sum(anzahl)
                                                                   FROM aggregat_kandidat_erststimmen ake
                                                                   WHERE ake.landtagswahl = $1 AND
                                                                   ake.stimmkreis_id = $2), 2)
                                                                   as prozent
FROM aggregat_kandidat_erststimmen ake, parteien p, kandidaten k
WHERE ake.landtagswahl = $1 AND
ake.stimmkreis_id = $2 AND
ake.kandidat_id = k.id AND
k.partei_id = p.id
ORDER BY ake.anzahl desc