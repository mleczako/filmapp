@echo off
REM Uruchom backend (Flask)
start cmd /k "python run.py"

REM Uruchom frontend (React)
start cmd /k "cd frontend && npm run dev"

REM Otwórz przeglądarkę na stronie aplikacji
start http://localhost:3000/