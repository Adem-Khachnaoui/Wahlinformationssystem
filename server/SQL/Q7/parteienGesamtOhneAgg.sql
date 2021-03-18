with help (partei, anzahl) as (
    select h.partei, sum(h.anzahl)
    from
        ((
             select p.name as partei, count(es.id) as anzahl
             from erststimmen es, direktkandidaturen dk, parteien p
             where dk.id = es.direktkandidatur_id
               and dk.stimmkreis_id = $2
               and dk.landtagswahl = $1
               and dk.partei_id = p.id
             group by p.name
         )
         union
         (
             select p.name as partei, count(zs.id) as anzahl
             from zweitstimmen zs, listenkandidaturen lk, parteien p, kandidaten k
             where lk.id = zs.listenkandidatur_id
               and lk.kandidat_id = k.id
               and zs.stimmkreis_id = $2
               and lk.landtagswahl = $1
               and k.partei_id = p.id
             group by p.name
         )
         union
         (
             select p.name as partei, count(zso.id) as anzahl
             from zweitstimmenohnekandidat zso, parteien p
             where  zso.stimmkreis_id = $2
               and zso.landtagswahl = $1
               and zso.partei_id = p.id
             group by p.name
         )
        ) as h
    group by h.partei
    order by sum(h.anzahl) desc
)
select h.partei, h.anzahl,  round(h.anzahl * 100.00/ (select sum(anzahl) from help) ,2) as prozent
from help h