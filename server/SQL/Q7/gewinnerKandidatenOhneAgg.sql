with gesamt_stimmkreis(anzahl) as(
    select count(es.id)
    from direktkandidaturen dk left outer join erststimmen es on dk.id = es.direktkandidatur_id
    where dk.landtagswahl = $1
      and dk.stimmkreis_id = $2)
select k.vorname, k.nachname, p.name as partei, count(es.id) as anzahl, round(count(es.id) * 100.00 / (select anzahl
                                                                                                       from gesamt_stimmkreis), 2) as prozent
from direktkandidaturen dk join kandidaten k on k.id = dk.kandidat_id
                           join parteien p on p.id = dk.partei_id
                           left outer join erststimmen es on dk.id = es.direktkandidatur_id
where dk.landtagswahl = $1
  and dk.stimmkreis_id = $2
group by k.vorname, k.nachname, p.name
order by count(es.id) desc
limit 5