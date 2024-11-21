from flask import Flask, redirect, request, Response
from g4f.client import Client
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import json
from datetime import datetime
import speech_recognition as sr
import requests
import subprocess
import os

app = Flask(__name__)
CORS(app, origins="https://www.projet-voltaire.fr")
client = Client()
r = sr.Recognizer()

@app.route("/")
def home():
  """This route redirect to the GitHub repository of the project."""
  return redirect("https://github.com/JustYuuto/projet-voltaire-bot", code=301)

@app.route("/robots.txt")
def robots():
  """This route return the robots.txt file."""
  response = Response("User-agent: *\nDisallow:")
  response.content_type = "text/plain"
  return response

@app.route("/fix-sentence", methods=["POST"])
def fix_sentence():
  """
  This route will fix a sentence, given in the body of the request. Hence, the only method allowed is POST.
  In the body, one parameter need to be given: "sentence", which is the sentence to fix.
  Here, we're using G4F to fix the sentence.
  """
  if not request.json or "sentence" not in request.json:
    response = Response(json.dumps({
      "status": 400,
      "message": "Bad Request",
      "description": "The request must be a JSON with a key \"sentence\"."
    }), status=400, content_type="application/json")
    raise HTTPException("Bad Request", response=response)

  now = datetime.now()
  sentence = request.json["sentence"]
  prompt = "Reply in french. Corrige les fautes dans cette phrase. Répond avec du JSON avec la clé \"sentence\" pour la phrase corrigée suivi de la clé \"word_to_click\" avec comme valeur le mot non corrigé qui a été corrigé. S'il n'y pas de faute \"word_to_click\" doit être null. \"{}\"".format(sentence)
  response = client.chat.completions.create(
    model="gpt-4",
    response_format={ "type": "json_object" },
    messages=[{
      "role": "user", "content": prompt
    }],
    max_tokens=500,
  )
  res_json = json.loads(response.choices[0].message.content)
  return Response(json.dumps({
    "sentence": sentence,
    "fixed_sentence": res_json["sentence"],
    "word_to_click": res_json["word_to_click"],
    "time_taken": (datetime.now() - now).total_seconds(),
  }), content_type="application/json")

@app.route("/intensive-training", methods=["POST"])
def intensive_training():
  """
  Perform intensive training using the Projet Voltaire Bot.

  This function takes a JSON request with a list of sentences and a rule, and uses the Projet Voltaire Bot to generate a response in French. The response is a JSON object that contains the correctness of each sentence according to the given rule.

  Returns:
    A JSON response containing the correctness of each sentence.

  Raises:
    HTTPException: If the request is invalid or missing required fields.

  thank you github copilot
  """
  if not request.json or "sentences" not in request.json or "rule" not in request.json:
    response = Response(json.dumps({
      "status": 400,
      "message": "Bad Request",
      "description": "The request must be a JSON with a key \"sentences\" and a key \"rule\"."
    }), status=400, content_type="application/json")
    raise HTTPException("Bad Request", response=response)

  sentences = request.json["sentences"]
  rule = request.json["rule"]
  prompt = "Reply in french. Suivant cette règle : \"{}\" Les phrases :\n- {}\nSont elles correctes ? Répond avec du JSON avec un tableau d'objets qui prend comme clés \"sentence\" pour la phrase et la clé \"correct\" si cette dernière est correcte.".format(rule, "\n- ".join(sentences))
  response = client.chat.completions.create(
    model="gpt-4",
    response_format={ "type": "json_object" },
    messages=[{
      "role": "user", "content": prompt
    }],
    max_tokens=500,
  )
  res_json = json.loads(response.choices[0].message.content)
  return Response(json.dumps(res_json), content_type="application/json")

@app.route("/put-word", methods=["POST"])
def put_word():
  """
  This word will add a missing word to the sentence given in the body of the request.
  The user also needs to provide the audio URL for completing the sentence with the missing word.
  It's using SpeechRecognition to get the missing word from the audio.
  """
  if not request.json or "sentence" not in request.json or "audio_url" not in request.json:
    response = Response(json.dumps({
      "status": 400,
      "message": "Bad Request",
      "description": "The request must be a JSON with a key \"sentence\" and a key \"audio_url\"."
    }), status=400, content_type="application/json")
    raise HTTPException("Bad Request", response=response)

  sentence: str = request.json["sentence"]
  if "{}" not in sentence:
    response = Response(json.dumps({
      "status": 400,
      "message": "Bad Request",
      "description": "The sentence must contain a \"{}\" to put the missing word."
    }), status=400, content_type="application/json")
    raise HTTPException("Bad Request", response=response)
  audio_url: str = request.json["audio_url"]
  print(sentence)
  if "  " in sentence:
    sentence = sentence.replace("  ", " {} ")

  audio_file = requests.get(audio_url)
  audio_filename = os.path.abspath("./tmp/audio{}.mp3".format(datetime.timestamp(datetime.now())))
  audio_wav_filename = audio_filename[:-3] + 'wav'
  with open(audio_filename, "wb") as f:
    f.write(audio_file.content)
  subprocess.run(['ffmpeg', '-i', audio_filename, audio_wav_filename])

  with sr.AudioFile(audio_wav_filename) as source:
    audio = r.record(source)

  fixed_sentence_stt: str = r.recognize_google(audio, language="fr-FR")
  try:
    missing_word_index = sentence.split(" ").index("{}")
  except ValueError:
    missing_word_index = sentence.split(" ").index("{}.")
  missing_word = fixed_sentence_stt.split()[missing_word_index]
  fixed_sentence = sentence.replace("{}", missing_word)

  os.remove(audio_filename)
  os.remove(audio_wav_filename)

  return Response(json.dumps({
    "sentence": sentence,
    "fixed_sentence": fixed_sentence,
    "missing_word": missing_word,
  }), content_type="application/json")

@app.route("/nearest-word", methods=["POST"])
def nearest_word():
  if not request.json or "word" not in request.json or "nearest_words" not in request.json:
    response = Response(json.dumps({
      "status": 400,
      "message": "Bad Request",
      "description": "The request must be a JSON with a key \"word\" and a key \"nearest_words\"."
    }), status=400, content_type="application/json")
    raise HTTPException("Bad Request", response=response)

  word: str = request.json["word"]
  nearest_words: list = request.json["nearest_words"]

  nearest_word = json.loads(client.chat.completions.create(
    model="gpt-4",
    response_format={ "type": "json_object" },
    messages=[{
      "role": "user", "content": "Reply in french. Quel est le mot le plus proche de \"{}\" parmis les suivants : {}. Répond en json avec une clé \"word\".".format(word, ", ".join(nearest_words))
    }],
    max_tokens=500,
  ).choices[0].message.content)

  return Response(json.dumps({
    "word": nearest_word['word'],
  }), content_type="application/json")

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    response = e.get_response()
    response.data = json.dumps({
      "status": e.code,
      "message": e.name,
      "description": e.description,
    })
    response.content_type = "application/json"
    return response
