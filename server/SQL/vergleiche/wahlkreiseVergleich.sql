with r8 as (
    select apg.partei_id, apg.wahlkreis_id, apg.anzahl
    from aggregat_partei_gesamtstimmen apg
    where apg.landtagswahl = 2018
), r3 as (
    select apg.partei_id, apg.wahlkreis_id, apg.anzahl
    from aggregat_partei_gesamtstimmen apg
    where apg.landtagswahl = 2013
)
select p.name as partei, r3.anzahl as anzahl2013, r8.anzahl as anzahl2018, round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8 where wahlkreis_id = $1)
                                                                                      - r3.anzahl * 1.0000 / (select sum(anzahl) from r3 where wahlkreis_id = $1)) * 100, 2) as prozent
from parteien p, r3, r8
where r8.wahlkreis_id = $1
and r8.wahlkreis_id = r3.wahlkreis_id
and r8.partei_id = r3.partei_id
and p.id = r8.partei_id
ORDER BY round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8 where wahlkreis_id = $1)
    - r3.anzahl * 1.0000 / (select sum(anzahl) from r3 where wahlkreis_id = $1)) * 100, 2) desc