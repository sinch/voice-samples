# Sinch Voice - node-callback-signature-verification

## Validate Incoming call events
This project validates a received verification signature contained in an incoming HTTP header for a [call event](https://developers.sinch.com/docs/voice/api-reference/#callback-api)  from the Sinch platform when using a [Sinch In-App calling Voice & Video](https://dashboard.sinch.com/voice/apps) application with a callback URL enabled.

### Requirements

- [node v16.*](https://nodejs.org/en/)
- [ngrok](https://ngrok.com)

### Install

- replace the required values in the `./index.js` file
- run `npm install` to install the required dependencies
- run the server using `node index.js`
- start ngrok `ngrok http 8000`
    - copy the ngrok url to the Voice & Video application you are using [Sinch Dashboard](https://dashboard.sinch.com/voice/apps)
    - make sure to append the following URI at the end of the URL, `/api/voice/callevents`
    - example `https://df6a-143-177-206-33.ngrok.io/api/voice/callevents`
