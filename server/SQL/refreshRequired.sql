select
((select count(*)
from erststimmen)
+
(select count(*)
 from zweitstimmen)
+
(select count(*)
 from zweitstimmenohnekandidat)
<>
(select sum(anzahl)
from aggregat_partei_gesamtstimmen)) as refreshrequired;
