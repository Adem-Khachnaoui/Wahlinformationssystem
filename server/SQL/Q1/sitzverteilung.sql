SELECT ab.partei as name, count(*) as anzahlsitze,
       round(count(*) * 100.0 / (select count(*) from abgeordneten where landtagswahl = $1), 2) as prozent
FROM abgeordneten ab
where ab.landtagswahl = $1
GROUP BY ab.partei
ORDER BY count(*) desc