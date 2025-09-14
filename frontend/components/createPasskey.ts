const sampleCreationOptions = {
  challenge: "dGVzdGlk",
  rp: {
    name: "Example",
    id: "localhost",
  },
  user: {
    id: "dGVzdGlk",
    name: "john78",
    displayName: "John",
  },
  pubKeyCredParams: [
    {
      alg: -7,
      type: "public-key",
    },
    {
      alg: -257,
      type: "public-key",
    },
  ],
  excludeCredentials: [],
  authenticatorSelection: {
    authenticatorAttachment: "platform",
    requireResidentKey: true,
  },
};


export const createPasskey = async (decoded_options=sampleCreationOptions) => {
    const options =
      PublicKeyCredential.parseCreationOptionsFromJSON(decoded_options as any);

    const credential = await navigator.credentials.create({
      publicKey: options,
    });

    console.log("Created credential: ");
    console.log(credential);

    return credential;
}