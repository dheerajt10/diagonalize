from flask import Flask, jsonify, request, Response, session
from flask_cors import CORS
import secrets
import smtplib
import os
import random
from webauthn import (
    generate_registration_options,
    options_to_json,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    ResidentKeyRequirement,
    RegistrationCredential,
    UserVerificationRequirement,
    PublicKeyCredentialDescriptor,
    AuthenticationCredential,
)
from webauthn.helpers import parse_authentication_credential_json, bytes_to_base64url, base64url_to_bytes, parse_registration_credential_json
from profile_contract import read_profile, store_profile
import threading


app = Flask(__name__)
# Set a unique and secret key for session support
app.secret_key = secrets.token_hex(32)
CORS(app)

# Store for WebAuthn challenges, keyed by email
challenge_store = {}

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
    try:
        data = request.get_json()
        email = data.get('email')
        otp = str(random.randint(100000, 999999))  # Generate 6-digit number
        # Store OTP in global dict and send email
        otp_store[email] = otp
        send_verification_email(email, otp)
        print(f"Signup requested for email: {email}, OTP: {otp}")
        resp = jsonify({'message': 'Verification email sent'})
        return resp
    except Exception as e:  
        return jsonify({'error': str(e)}), 500


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


@app.route("/webauthn/register", methods=["GET"])
def webauthn_register():
    email = request.args.get("email")
    if not email and request.is_json:
        json_data = request.get_json(silent=True)
        if json_data:
            email = json_data.get("email")
    if not email:
        return jsonify({"error": "Missing email for challenge storage"}), 400
    options = generate_registration_options(
        # TODO: set ID based on actual user id
        user_id=bytes(1),
        user_name=email,
        rp_id="localhost",
        rp_name="localhost",
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.DISCOURAGED,
        ),
        exclude_credentials=[],
    )
    challenge_store[email] = options.challenge
    return options_to_json(options)

def get_domain_from_email(email):
    try:
        domain = email.split('@')[1].split('.')[0]
        return domain.capitalize()
    except Exception:
        return ""

@app.route("/webauthn/register/submit", methods=["POST"])
def webauthn_register_submit():
    try:
        data = request.get_json()
        credential_data = data.get("credential")
        email = data.get("email")
        username = data.get("username")
        credential = parse_registration_credential_json(credential_data)

        challenge = challenge_store.pop(email, None)
        if not challenge:
            return jsonify({"error": "missing challenge for this email"}), 400

        verification = verify_registration_response(
            credential=credential,
            expected_challenge=challenge,
            expected_rp_id="localhost",
            expected_origin="http://localhost:3000",
            require_user_verification=False,
        )

        auth_key = {
            'credential_id': bytes_to_base64url(verification.credential_id),
            'public_key': bytes_to_base64url(verification.credential_public_key),
            'sign_count': verification.sign_count,
        }

        # Store profile on chain asynchronously
        threading.Thread(
            target=store_profile,
            kwargs={
                'key_to_store': auth_key['public_key'],
                'username_to_store': username,
                'company_to_store': get_domain_from_email(email)
            },
            daemon=True
        ).start()

        return jsonify({"message": "Successfully logged in"})
    except Exception as e:
        print(f"Error in webauthn_register_submit: {e}")
        return jsonify({"error": "invalid credential response"})


# @app.route("/webauthn/login", methods=["GET", "POST"])
# def webauthn_login():
#     if request.method == "GET":
#         options = generate_authentication_options(
#             rp_id="http://localhost:3000",
#             user_verification=UserVerificationRequirement.DISCOURAGED,
#         )
#         session["challenge"] = options.challenge
#         return options_to_json(options)
#     else:
#         session.pop("user_id")
#         try:
#             data = request.get_json()
#             credential = parse_authentication_credential_json(data.get("credential"))
#             username = data.get("username")

#             # Get public key from username from chain
#             public_key="..."

#             verification = verify_authentication_response(
#                 credential=credential,
#                 expected_challenge=session.pop("challenge"),
#                 expected_rp_id="http://localhost:3000",
#                 expected_origin="localhost",
#                 credential_public_key=base64url_to_bytes(public_key),
#                 # https://www.imperialviolet.org/2023/08/05/signature-counters.html
#                 credential_current_sign_count=0,
#                 require_user_verification=False,
#             )

#             session["user_id"] = username
#             return jsonify({"message": "Successfully logged in"})
#         except Exception as e:
#             print(f"Error in webauthn_register_submit: {e}")
#             return jsonify({"error": "invalid credential response"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)
