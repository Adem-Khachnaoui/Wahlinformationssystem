SELECT  p.name as partei, apg.anzahl, round(apg.anzahl * 100.00 / (SELECT sum(anzahl)
                                                                    FROM aggregat_partei_gesamtstimmen apg
                                                                    WHERE apg.landtagswahl = $1 AND
                                                                    apg.wahlkreis_id = $2), 2)
                                                                    as prozent
FROM aggregat_partei_gesamtstimmen apg , parteien p
WHERE apg.landtagswahl = $1 AND
apg.wahlkreis_id = $2 AND
apg.partei_id = p.id
ORDER BY apg.anzahl desc