WITH onlinewaehler as (
    select count(*) as waehlerzahl
    from stimmkreise s, validtokens vt
    where s.wahlkreis_id = $2 and
          s.id = vt.stimmkreis_id and
          vt.hat_gewaehlt = true and
          $1 = 2018
)
SELECT  sum(w.wahlberechtigte) as wahlberechtigte,
        (select sum(w.waehler) + waehlerzahl from onlinewaehler) as waehler,
        round((select sum(w.waehler) + waehlerzahl from onlinewaehler) * 100.00 / sum(w.wahlberechtigte), 2) as beteiligung
FROM wahlbeteiligung w, stimmkreise s
WHERE w.landtagswahl = $1 AND
        s.wahlkreis_id = $2 AND
        s.id = w.stimmkreis_id
GROUP BY s.wahlkreis_id