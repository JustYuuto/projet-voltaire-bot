@echo off
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask --app main run
pause
