with parteien_anteil_gesamtstimmen as(
    select apg.partei_id, cast(sum(anzahl) as decimal(10,2)) * 100 / (select sum(anzahl) as gesamtanzahl
                                                                      from aggregat_partei_gesamtstimmen apg1
                                                                      where apg1.landtagswahl = $1
    ) as anteil
    from aggregat_partei_gesamtstimmen apg
    where apg.landtagswahl = $1
    group by apg.partei_id
),
-- Welche Parteien haben mehr als 5% der Gesamtstimmen bekommen.
     parteien_ueber_huerde as(
         select *
         from parteien_anteil_gesamtstimmen pag
         where pag.anteil > 5
     )

SELECT a.kandidat_id, a.vorname, a.nachname, s.name as stimmkreis, akea.anzahl - max(ake.anzahl) as vorsprung
from abgeordneten a, aggregat_kandidat_erststimmen akea, aggregat_kandidat_erststimmen ake, direktkandidaturen dk, stimmkreise s
where a.partei = $2
  and a.landtagswahl = $1
  and akea.landtagswahl = $1
  and akea.landtagswahl = ake.landtagswahl
  and akea.landtagswahl = dk.landtagswahl
  and a.direktkandidat = TRUE
  and a.kandidat_id = akea.kandidat_id
  and akea.stimmkreis_id = dk.stimmkreis_id
  and dk.partei_id in ( select puh.partei_id from parteien_ueber_huerde puh)
  and ake.kandidat_id = dk.kandidat_id
  and akea.anzahl > ake.anzahl
  and s.id = akea.stimmkreis_id
group by a.kandidat_id, a.vorname, a.nachname, s.name, akea.anzahl
order by akea.anzahl - max(ake.anzahl) asc
limit 10