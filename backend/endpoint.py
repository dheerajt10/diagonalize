from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import secrets
import smtplib
import os

app = Flask(__name__)
CORS(app)

@app.route("/emails", methods=["GET"])
def get_emails():
    log_path = "log.log"
    if not os.path.exists(log_path):
        return Response("No emails found.", mimetype="text/plain")
    with open(log_path, "r") as f:
        content = f.read()
    return Response(content, mimetype="text/plain")

otp_store = {}

# Send a secure verification email to a user
# Assumes email server running on the same system
def send_verification_email(email, otp):
    FROM = "verify@diagnonlize-auth.com"
    TO = [email]
    SUBJECT = "Verify your email with Diagonalize"
    BODY = f"Please enter the following code to verify your email - {otp}"

    message = f"""\
    From: {FROM}
    To: {', '.join(TO)}
    Subject: {SUBJECT}

    {BODY}
    """

    with smtplib.SMTP("127.0.0.1", 1026) as server:
        server.sendmail(FROM, TO, message)

@app.route('/')
def home():
    return 'Flask endpoint is running!'

@app.route('/status')
def status():
    return jsonify({'status': 'ok'})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    otp = secrets.token_urlsafe(16)
    # Store OTP in global dict and send email
    otp_store[email] = otp
    send_verification_email(email, otp)
    resp = jsonify({'message': 'Verification email sent'})
    return resp


@app.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    email = data.get("email")
    otp_from_body = data.get("otp")
    otp_expected = otp_store.get(email)
    if otp_from_body and otp_expected and otp_from_body == otp_expected:
        resp = jsonify({"success": True, "message": "Verification successful"})
        resp.set_cookie("verified", "true", httponly=True, samesite="Lax", secure=True)
        # Optionally, remove OTP after successful verification
        otp_store.pop(email, None)
        return resp
    else:
        return jsonify({"success": False, "message": "Invalid or missing OTP"}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)