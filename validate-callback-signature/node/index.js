const crypto = require("crypto");
const express = require("express");
const app = express();
app.use(express.raw({ type: "*/*" }));
const port = 8000;

/*
    The key from one of your Verification Apps, found here https://dashboard.sinch.com/verification/apps
*/

const APPLICATION_KEY = "<REPLACE_WITH_APP_KEY>";

/*
    The secret from the Verification App that uses the key above, found here https://dashboard.sinch.com/verification/apps
*/

const APPLICATION_SECRET = "<REPLACE_WITH_APP_SECRET>";

app.post("/api/voice/callevents", (req, res) => {
  let hash = crypto.createHash("md5");
  let authHeader = req.header("Authorization");
  let requestBody = req.body;
  let requestMethod = req.method;

  function verifySignature(authHeader, requestBody, requestMethod) {
    const authValue = authHeader.split(/[ :]/);
    const callbackKey = authValue[1];
    const callbackSignature = authValue[2];

    if (callbackKey !== APPLICATION_KEY) {
      console.log(
        "The keys do not match, the HTTP request did not originate from Sinch!"
      );
      let verificationStatus = 0;
      return verificationStatus;
    }

    const contentMD5 = hash.update(requestBody).digest("base64");
    const requestContentType = req.header("Content-Type");
    const requestTimestamp = req.header("x-timestamp");
    const requestPath = req.baseUrl + req.path;

    let stringToSign =
      requestMethod +
      "\n" +
      contentMD5 +
      "\n" +
      requestContentType +
      "\n" +
      "x-timestamp:" +
      requestTimestamp +
      "\n" +
      requestPath;

    let hmac = crypto.createHmac(
      "sha256",
      Buffer.from(APPLICATION_SECRET, "base64")
    );
    hmac.update(stringToSign);
    let calculatedSignature = hmac.digest("base64");

    if (calculatedSignature !== callbackSignature) {
      console.log(
        "The signatures do not match, the HTTP request did not originate from Sinch!"
      );
      const verificationStatus = 0;
      return verificationStatus;
    } else {
      console.log(
        "Callback signature validation was successful, the hashes match!"
      );
      const verificationStatus = 1;
      return verificationStatus;
    }
  }

  if (verifySignature(authHeader, requestBody, requestMethod) == 1) {
    const eventBody = JSON.parse(req.body.toString("utf8"));
    console.log("Call event: ", eventBody.event);
    console.log("Call event body: ", eventBody);

    switch (eventBody.event) {
      case "ice":
        /*
          Handle a Answer Call Event
        */

        res.json(confAnnoucement);
        break;

      case "dice":
        /*
          Handle a Disconnect Call Event
          200 OK is expected
         */
        res.sendStatus(200);
        break;

      default:
        res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

/*
  Listener
*/

app.listen(port, () => {
  console.log(
    `Listening on port ${port}, the app will start listening to incoming call events and verifying the signatgure contained in the HTTP header from Sinch and routing call with example SVAML Conference event`
 );
});

/*
  Sample SVAML responses
*/

const ConfId = Math.round(Date.now() / 1000);

const confAnnoucement = {
  instructions: [
    {
      name: "say",
      text: "Conference test",
      locale: "en-US",
    },
  ],
  action: {
    name: "ConnectConf",
    conferenceId: "conftest-" + ConfId,
    suppressCallbacks: false,
    moh: "music2",
  },
};

const connectMxp = {
  action: {
    name: "connectMXP",
  },
};
