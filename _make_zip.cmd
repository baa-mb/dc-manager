set pz=C:\Programme\7-Zip\7z.exe
set Datum=%date:~6,4%-%date:~3,2%-%date:~0,2%

%pz% a -t7z -r zzz_old\%datum%_sich.7z *.php *.html *.js *.css

timeout 5