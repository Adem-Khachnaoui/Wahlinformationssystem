SELECT k.id, k.vorname, k.nachname, s.name as stimmkreis, akea.anzahl - ake.anzahl as rueckstand
from abgeordneten a, aggregat_kandidat_erststimmen akea, aggregat_kandidat_erststimmen ake, direktkandidaturen dk, parteien p, kandidaten k, stimmkreise s
where p.name = $2
  and a.landtagswahl = $1
  and p.id = dk.partei_id
  and akea.landtagswahl = $1
  and akea.landtagswahl = ake.landtagswahl
  and akea.landtagswahl = dk.landtagswahl
  and a.direktkandidat = TRUE
  and a.kandidat_id = akea.kandidat_id
  and akea.stimmkreis_id = dk.stimmkreis_id
  and ake.kandidat_id = dk.kandidat_id
  and k.id = dk.kandidat_id
  and akea.anzahl > ake.anzahl
  and s.id = akea.stimmkreis_id
order by akea.anzahl - ake.anzahl asc
limit 10