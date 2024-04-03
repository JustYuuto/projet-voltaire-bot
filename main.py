from flask import Flask, redirect, request, Response
from g4f.client import Client
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
client = Client()

@app.route("/")
def home():
  """This route redirect to the GitHub repository of the project."""
  return redirect("https://github.com/JustYuuto/projet-voltaire-bot", code=301)

@app.route("/robots.txt")
def robots():
  """This route return the robots.txt file."""
  response = Response("User-agent: *\nDisallow: /")
  response.content_type = "text/plain"
  return response

@app.route("/fix-sentence", methods=["POST"])
def fix_sentence():
  """
  This route will fix a sentence, given in the body of the request. Hence, the only method allowed is POST.
  In the body, one parameter need to be given: "sentence", which is the sentence to fix.
  Here, we're using Gpt4Free to fix the sentence.
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
  prompt = "Reply in french. Corrige les fautes dans cette phrase. \"{}\"".format(sentence)
  response = client.chat.completions.create(
    model="gpt-4",
    response_format={ "type": "json_object" },
    messages=[{
      "role": "user", "content": prompt
    }],
    max_tokens=500,
  )
  return Response(json.dumps({
    "sentence": sentence,
    "fixed_sentence": response.choices[0].message.content,
    "time_taken": (datetime.now() - now).total_seconds(),
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
