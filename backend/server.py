import asyncio
from aiosmtpd.controller import Controller
from email import message_from_bytes
from email.policy import default
from io import BytesIO
import os
import json

email_passwords = {
    "username@apple.com": "admin_password",
    "user1@localhost": "user1_password",
    "username@google.com": "user2_password"
}

class CustomSMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        peer = session.peer
        mailfrom = envelope.mail_from
        rcpttos = envelope.rcpt_tos
        data = envelope.content

        print('Peer:', peer)
        print('Mail from:', mailfrom)
        print('Rcpt to:', rcpttos)

        msg = message_from_bytes(data, policy=default)

        # Prepare log entry as dict for JSON
        log_entry = {
            "peer": str(peer),
            "mail_from": mailfrom,
            "rcpt_to": rcpttos,
            "subject": msg.get('Subject', ''),
        }
        body = msg.get_body(preferencelist=('plain'))
        #print(body)
        log_entry["body"] = body.get_content()
        print(log_entry["body"])

        """
        if len(body)>0:
            print("BODY")
            log_entry["body"] = body.get_content()
        else:
            print("NO BODY")
            log_entry["body"] = None
        """

        attachments = []
        for rcptto in rcpttos:
            if rcptto in email_passwords:
                log_entry["message_for"] = rcptto
                for part in msg.iter_attachments():
                    content_type = part.get_content_type()
                    attachments.append({
                        "type": content_type,
                        "info": "ignored"})
            else:
                log_entry["unknown_recipient"] = rcptto
                log_entry["attachments"] = attachments
                # Read existing log
                try:
                    with open('log.log', 'r') as f:
                        log_data = f.read().strip()
                        logs = json.loads(log_data) if log_data else []
                except Exception:
                    logs = []
                logs.append(log_entry)
                with open('log.log', 'w') as f:
                    json.dump(logs, f, indent=2)
                return '550 Unknown recipient'
        log_entry["attachments"] = attachments
        # Read existing log
        try:
            with open('log.log', 'r') as f:
                log_data = f.read().strip()
                logs = json.loads(log_data) if log_data else []
        except Exception:
            logs = []
        logs.append(log_entry)
        with open('log.log', 'w') as f:
            json.dump(logs, f, indent=2)
        return '250 Message accepted for delivery'

def run_server():
    # Clear log.log on startup
    with open('log.log', 'w') as f:
        f.write('')
    handler = CustomSMTPHandler()
    controller = Controller(handler, hostname='0.0.0.0', port=1026)
    controller.start()

    print("SMTP server is running. Press Ctrl+C to stop.")
    try:
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        controller.stop()

if __name__ == "__main__":
    run_server()
