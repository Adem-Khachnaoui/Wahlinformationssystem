select  a.vorname, a.nachname, a.partei, w.name as wahlkreis
from abgeordneten a join wahlkreise w
on a.landtagswahl = $1 and a.wahlkreis_id = w.id
order by a.partei, a.vorname, a.nachname