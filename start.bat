@echo off
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
flask --app main run
pause
