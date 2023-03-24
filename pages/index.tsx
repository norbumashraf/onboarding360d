<ConnectButton
partnerId={f167CmPA}
callback={() => {
  console.log("Client ID: " + callbackObject.client);
  console.log("Channel IDs: " + callbackObject.channels);
  if (callbackObject.revokedChannels) {
    console.log("Revoked Channel IDs: " + callbackObject.revokedChannels);
  }
}}
className="" // <-- Insert your own styles via className definition or through inline styling
label="WABA Onboard"
queryParameters={{
	redirect_url: "http://test.com/test"
}}
/>
