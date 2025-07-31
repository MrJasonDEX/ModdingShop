@echo off
setlocal EnableDelayedExpansion

:: Source folder with all PNGs
set "source=E:\Users\Jason\Desktop\6,288 Premium Modded Avatars\PNG_files - Copy"

:: Destination base folder for sets
set "dest=E:\Users\Jason\Desktop\6,288 Premium Modded Avatars\PNG_Sets"

:: Make sure the destination folder exists
if not exist "%dest%" mkdir "%dest%"

:: Counter setup
set count=0
set setnum=1

:: Create first folder
set "currentfolder=%dest%\Set_!setnum!"
mkdir "%currentfolder%"

:: Loop through PNG files
for %%f in ("%source%\*.png") do (
    copy "%%f" "!currentfolder!" >nul
    set /a count+=1

    if !count! EQU 100 (
        set /a setnum+=1
        set /a count=0
        set "currentfolder=%dest%\Set_!setnum!"
        mkdir "!currentfolder!"
    )
)

echo Done! Files split into sets of 100.
pause
