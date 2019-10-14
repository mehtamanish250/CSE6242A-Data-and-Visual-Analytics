from flask import Flask, render_template, request, json
import re

app = Flask(__name__)

@app.route('/')
def hello():
	return render_template('hello.html')

@app.route('/signup')
def signup():
	return render_template('signup.html')

@app.route('/signupuser', methods=['POST'])
def signupuser():
	user =  request.form['username'];
	password = request.form['password'];
	passlist = [];
	status = "OK";

	if (len(password) < 8):
		passlist.append(1)
		status = "BAD"
	if (not any(c.isupper() for c in password)):
		passlist.append(2)
		status = "BAD"
	if (not any(c.isdigit() for c in password)):
		passlist.append(3)
		status = "BAD"

	if (status == "BAD"):
		return json.dumps({'status':'BAD','user':user,'pass':passlist});
	else:
		return json.dumps({'status':'OK','user':user,'pass':password});

if __name__=="__main__":
	app.run()
