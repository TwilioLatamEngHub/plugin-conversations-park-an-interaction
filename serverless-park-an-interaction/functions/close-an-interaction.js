const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient()

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid
  const conversationSid = event.conversationSid

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
