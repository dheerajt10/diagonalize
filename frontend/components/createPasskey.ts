export const createPasskey = () => {
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  // `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
  // `isConditionalMediationAvailable` means the feature detection is usable.
  let passkeyAvailable = false;
  if (
    window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    PublicKeyCredential.isConditionalMediationAvailable
  ) {
    // Check if user verifying platform authenticator is available.
    Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable(),
    ]).then((results) => {
      if (results.every((r) => r === true)) {
        // Display "Create a new passkey" button
        passkeyAvailable = true;
      }
    });
  }

  if (!passkeyAvailable) throw new Error("Your browser does not support passkeys!");

  
}