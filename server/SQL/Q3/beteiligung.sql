WITH onlinewaehler as (
    select count(*) as waehlerzahl
    from validtokens vt
    where vt.stimmkreis_id = $2 and
          vt.hat_gewaehlt = true and
          $1 = 2018
)
select w.wahlberechtigte,
       (select w.waehler + waehlerzahl from onlinewaehler) as waehler,
       round((select w.waehler + waehlerzahl from onlinewaehler) * 100.00 / case when w.wahlberechtigte = 0 then 1
                                                                            else w.wahlberechtigte end, 2) as beteiligung
from wahlbeteiligung w
where w.landtagswahl = $1 and
      w.stimmkreis_id = $2