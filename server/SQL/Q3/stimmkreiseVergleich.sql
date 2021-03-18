with r8 as (
    SELECT aps.partei_id, aps.stimmkreis_id, aps.anzahl
    FROM aggregat_partei_stimmkreis_gesamtstimmen aps
    WHERE aps.landtagswahl = 2018 AND
            aps.stimmkreis_id = $1
), r3 as (
    SELECT aps.partei_id, aps.stimmkreis_id, aps.anzahl
    FROM aggregat_partei_stimmkreis_gesamtstimmen aps
    WHERE aps.landtagswahl = 2013 AND
            aps.stimmkreis_id = $1
)
SELECT  p.name as partei, r3.anzahl as anzahl2013, r8.anzahl as anzahl2018, round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8 where stimmkreis_id = $1)
                                                                                       - r3.anzahl / (select sum(anzahl) from r3 where stimmkreis_id = $1)) * 100, 2) as prozent
FROM parteien p, r3, r8
WHERE r3.partei_id = r8.partei_id AND
p.id = r3.partei_id
ORDER BY round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8 where stimmkreis_id = $1)
    - r3.anzahl / (select sum(anzahl) from r3 where stimmkreis_id = $1)) * 100, 2) desc