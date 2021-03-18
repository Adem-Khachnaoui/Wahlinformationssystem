with r8 as (
    select apg.partei_id, sum(apg.anzahl) as anzahl
    from aggregat_partei_gesamtstimmen apg
    where apg.landtagswahl = 2018
    group by apg.partei_id
), r3 as (
    select apg.partei_id, sum(apg.anzahl) as anzahl
    from aggregat_partei_gesamtstimmen apg
    where apg.landtagswahl = 2013
    group by apg.partei_id
)
select p.name as partei, r3.anzahl as anzahl2013, r8.anzahl as anzahl2018, round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8)
                                                                                      - r3.anzahl * 1.0000 / (select sum(anzahl) from r3) ) * 100, 2) as prozent
from parteien p, r8, r3
where r8.partei_id = r3.partei_id
and p.id = r8.partei_id
ORDER BY round((r8.anzahl * 1.0000 / (select sum(anzahl) from r8)
    - r3.anzahl * 1.0000 / (select sum(anzahl) from r3) ) * 100, 2) desc