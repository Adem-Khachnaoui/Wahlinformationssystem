SELECT  p.name as partei, aps.anzahl, round(aps.anzahl * 100.00 / (SELECT sum(anzahl)
                                                                   FROM aggregat_partei_stimmkreis_zweitstimmen aps
                                                                   WHERE aps.landtagswahl = $1 AND
                                                                   aps.stimmkreis_id = $2), 2)
                                                                   as prozent
FROM aggregat_partei_stimmkreis_zweitstimmen aps , parteien p
WHERE aps.landtagswahl = $1 AND
aps.stimmkreis_id = $2 AND
aps.partei_id = p.id
ORDER BY aps.anzahl desc