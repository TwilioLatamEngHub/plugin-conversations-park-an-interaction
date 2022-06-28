exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid
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
    // Fetch the webhook sid so we can remove it
    const { webhookSid } = await client.conversations
      .conversations(conversationSid)
      .fetch()
      .then(convo => {
        const attributes = JSON.parse(convo.attributes)
        return {
          webhookSid: attributes.webhookSid
        }
      })

    // Remove the webhook
    await client.conversations
      .conversations(conversationSid)
      .webhooks(webhookSid)
      .remove()

    // Close the interaction
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .update({ status: 'closed' })
      .then(interaction_channel => {
        console.log('interaction_channel')
        console.log(interaction_channel)
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
