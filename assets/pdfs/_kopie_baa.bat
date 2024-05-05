rem im downloadordner ab23
@echo Nur mehr von DOM/dlpl/dc/pdf kopieren
echo "%~dp0"
if NOT "%~dp0" == "d:\WEB\_hosteu\dom\dlpl\dc\assets\pdfs\" goto :eee

 
rem xcopy *.* d:\WEB\_hosteu\dom\dlpl\dc\assets\pdfs /d
xcopy *.* d:\WEB\_hosteu\projekte\dc\assets\pdfs /d /s
xcopy *.* d:\WEB\_hosteu\projekte\beebot-dlpl4\kcfinder\upload\files /d /s

pause

:eee
echo URPFAD ist falsch
pause