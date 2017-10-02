import json
import random
import smtplib
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from email.mime.text import MIMEText

class MyServer(BaseHTTPRequestHandler):
	
	# GET Request
	def do_GET(self):
		statusCode = 404;
		headers = []
		response = ""
		query = parse_qs(urlparse(self.path).query)
		headers.append(("Content-Type","text/plain"))
		response = "404: Yeah, there's nothing here."
		self.send_response(statusCode)
		for a,b in headers:
			self.send_header(a,b)
		self.end_headers()
		self.wfile.write(bytes(response, "utf-8"))
		return
	
	# POST Request
	def do_POST(self):
		statusCode = 404;
		headers = []
		response = ""
		
		# write response
		if self.path.startswith("/secretsanta"):
			headers.append(("Content-Type","text/plain"))
			headers.append(("Access-Control-Allow-Origin", "*"))
			length = int(self.headers["Content-Length"])
			body = self.rfile.read(length).decode("utf-8")
			data = json.loads(body)
			if processGiftExchange(data):
				statusCode = 201
				response = "Success: all emails sent."
			else:
				statusCode = 500
				response = "Error: no emails were sent."
		self.send_response(statusCode)
		for a,b in headers:
			self.send_header(a,b)
		self.end_headers()
		self.wfile.write(bytes(response, "utf-8"))
		return

def processGiftExchange(data):
	message = data["message"]
	exclude = data["exclude"]
	cost = data["cost"]
	secret = data["secret"]
	people = data["people"]
	recipients = randomizeRecipients(people, exclude)
	if recipients:
		emailMessages = createEmails(message,cost,secret,people,recipients)
		return sendEmails(emailMessages)
	else:
		print("Error: Could not find legal recipient list.")
		return False

def randomizeRecipients(people, exclude):
	print("Randomizing...")
	length = len(people)
	recipients = []
	complete = False
	totaltries = 0
	while totaltries < length * 3 and not complete:
		recipients = [-1] * length
		selected = [False] * length
		i = totaltries % length
		fail = False
		complete = 0
		while not fail and not complete == length:
			subtries = 0
			j = random.randrange(length)
			while subtries < length and (j == i or selected[j] or (exclude and j == people[i]["exclude"])):
				j = (j + 1) % length
				subtries += 1
			if (subtries == length):
				fail = True
			else:
				recipients[i] = j
				selected[j] = True
				i = (i + 1) % length
				complete += 1
		complete = not fail
		totaltries += 1
	if not complete:
		return False
	else:
		return recipients

def createEmails(message,cost,secret,people,recipients):
	messages = []
	howmuch = "\n\nYou should spend about $" + cost
	isSecret = ""
	if (secret):
		isSecret = ", and you should keep your recipient secret."
	else:
		isSecret = "."
	for i in range(len(people)):
		peep = people[i]
		recipient = people[recipients[i]]
		greeting = "Hey " + peep["name"] + ","
		youget = "\n\nFor this year's gift exchange, your recipient is " + recipient["name"] + ". Here is what they want:"
		giftlist = "\n" + recipient["wishList"]
		footer = "\n\nHave fun, and Merry Christmas!"
		emailbody = greeting + youget + giftlist + howmuch + isSecret + "\n\n" + message + footer
		messages.append((peep["email"],emailbody))
	return messages

def sendEmails(emailMessages):
	fromAddress = "timsims1717@gmail.com"
	username = "timsims1717"
	password = "leftoverPizza42"
	server = smtplib.SMTP('smtp.gmail.com:587')
	server.ehlo()
	server.starttls()
	server.login(username,password)
	for toAddress,body in emailMessages:
		message = MIMEText(body)
		message["Subject"] = "2016 Gift Exchange"
		message["From"] = fromAddress
		message["To"] = toAddress
		server.sendmail(fromAddress, [toAddress], message.as_string())
	server.quit()
	return True

def run():
	listen = ("127.0.0.1",8080)
	server = HTTPServer(listen, MyServer)
	
	print ("Listening...")
	server.serve_forever()

run()

