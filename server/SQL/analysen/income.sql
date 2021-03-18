with gesamt_stimmkreise(stimmkreis_id, anzahl) as (
    select aps.stimmkreis_id, sum(aps.anzahl)
    from aggregat_partei_stimmkreis_gesamtstimmen aps
    where aps.landtagswahl = $1
    group by aps.stimmkreis_id
)
select e.einkommen, round(avg(aps.anzahl * 100.00 / (select gs.anzahl
                                                     from gesamt_stimmkreise gs
                                                     where gs.stimmkreis_id = aps.stimmkreis_id)), 2) as anteil_stimmen
from einkommen e, stimmkreise s, aggregat_partei_stimmkreis_gesamtstimmen aps, parteien p
where e.stimmkreis like '%' || s.name  ||'%' and
     e.stimmkreis like '%Lkr%' and
     s.id = aps.stimmkreis_id and
     aps.partei_id = p.id and
     p.name = $2 and
     aps.landtagswahl = $1
group by e.einkommen
order by e.einkommen