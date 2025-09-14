# Diagonalize

Diagonalize is a privacy-preserving, verifiable OAuth system built on EigenCloud. It leverages Trusted Execution Environments (TEEs) to validate emails and other dynamic identity attributes, ensuring that sensitive user data remains confidential—even from the application operator. After verification, Diagonalize uses WebAuthn to bind client public keys to user IDs, providing authentication without exposing user activity to third parties.

## Motivation

**Traditional OAuth Issues:**
- When you sign in with Google or similar providers, those companies know which sites you use, creating privacy risks.
- Creating individual credentials for every app burdens developers with email verification and exposes users to privacy issues, as seen in data leaks (e.g., Glassdoor).
- Pseudonymous apps (like Blind) offer some privacy, but in-group leaks or operator access can still compromise user data.

**Diagonalize Solution:**
- Uses TEEs on EigenCloud to securely run email and identity validation, so even the app operator cannot see sensitive data. EigenLayer also gives operators incentives for high availability. 
- After validation, binds a WebAuthn public key to the user, enabling passwordless, phishing-resistant authentication.
- Keeps user identity and activity private from both the OAuth provider and the application operator.
- In the future, with cross-domain passkeys, these identities can be reused across multiple applications, turning this method into a powerful way to do decentralized identity on the web. 

## How It Works

1. **User requests authentication** via Diagonalize on a third-party app.
2. **TEE validates identity** (e.g., email) without exposing data to the app operator. For the email implementation, our 
3. **WebAuthn registration**: After successful validation, the user's device generates a public/private key pair. The public key is bound to the user ID.
4. **Publish on Chain**: The username, corresponding public key, and the relevant claim (eg. the company you work at, verified through email) are published on chain, along with the attestation from EigenCloud. 
5. **Authentication**: On subsequent logins, the user authenticates with their device using WebAuthn, with no passwords or shared secrets. Third party applications can use the credentials published on chain after verifying the attestations, thus giving them confidence in the validation without seeing any of the user's data.

## Key Features

- **Privacy-first OAuth**: No central provider can track which apps you use.
- **Verifiable identity**: Dynamic attributes (like email) are validated in a TEE.
- **Operator in the cold**: Even app admins can't see user secrets or validation data.
- **WebAuthn integration**: Strong, passwordless authentication.
- **Developer-friendly**: No need to build custom email verification flows.
- **Persisted on-chain**: Third party apps can reuse the validation for the same key holder.  

## Project Structure

- `backend/`: Python SMTP server, API server. Runs in EigenCloud
- `contracts/`: Profile storage smart contract
- `frontend/`: Next.js app with WebAuthn and OAuth flows

## Getting Started

1. Clone the repository
2. Follow setup instructions in `backend/README.md` and `frontend/README.md`
3. Run the backend and frontend servers
4. Register and authenticate using the demo app

## Learn More

- [WebAuthn](https://webauthn.io/)
- [Trusted Execution Environments](https://en.wikipedia.org/wiki/Trusted_execution_environment)
- [EigenCloud](https://eigencloud.com/)

---
Diagonalize: Secure, private, and verifiable authentication for the modern web.
# Diagonalize

