const axios = require('axios')
const FormData = require('form-data')

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()
  const INTERACTIONS_URL = context.INTERACTIONS_URL
  const CONVERSATIONS_WEBHOOK_URL = context.CONVERSATIONS_WEBHOOK_URL

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid
  const participantSid = event.participantSid
  const conversationSid = event.conversationSid

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  try {
    const closeParticipantUrl = `${INTERACTIONS_URL}/${interactionSid}/Channels/${channelSid}/Participants/${participantSid}`
    const formData = new FormData()
    formData.append('Status', 'closed')

    await axios({
      method: 'post',
      url: closeParticipantUrl,
      data: formData,
      headers: formData.getHeaders(),
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN
      }
    })

    await client.conversations
      .conversations(conversationSid)
      .webhooks.create({
        'configuration.method': 'POST',
        'configuration.filters': ['onMessageAdded'],
        'configuration.url': CONVERSATIONS_WEBHOOK_URL,
        target: 'webhook'
      })
      .then(webhook => {
        console.log('webhook')
        console.log(webhook)
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
