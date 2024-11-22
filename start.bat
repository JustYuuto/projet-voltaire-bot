@echo off
pip install -r requirements.txt
python -m flask --app main run
pause
