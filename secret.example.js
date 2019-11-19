import { Base64 } from "./src/utils";

// Disclaimer: This is not a secure way of storing secrets.
// Read more: https://aaronparecki.com/oauth-2-simplified/

// Get your client ID and secret
// https://developer.spotify.com/dashboard/applications
const secretExample = {
  clientId: "123345",
  clientSecret: "12345",
};

// The client ID and secret are base64 encoded in the following format:
// clientId:clientSecret
export const encodedExample = Base64.btoa(
  secret.clientId + ":" + secret.clientSecret,
);

export default secretExample;
