# Setup

### Serverless

Create a .env in the serverless folder according to the .env.example. To test locally, npm i and run twilio serverless:start.

Important: To test locally, the CONVERSATIONS_WEBHOOK_URL in the .env must be a ngrok server with /unpark-an-interaction. Ex.: Twilio function <span>htt</span>p://localhost:3000/unpark-an-interaction would be <span>htt</span>p://ab70d898ec3b.ngrok.io/unpark-an-interaction

### Plugin

In the constants.js file change the URLs accordingly to your Twilio functions. To test locally, npm i and run twilio flex:plugins:start
