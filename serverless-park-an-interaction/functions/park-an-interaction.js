exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()
  const CONVERSATIONS_WEBHOOK_URL = context.CONVERSATIONS_WEBHOOK_URL

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid
  const participantSid = event.participantSid
  const conversationSid = event.conversationSid
  const taskSid = event.taskSid
  const workflowSid = event.workflowSid
  const taskChannelUniqueName = event.taskChannelUniqueName
  const targetSid = event.targetSid
  const workerName = event.workerName
  const taskAttributes = event.taskAttributes

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  try {
    // Remove the agent
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .participants(participantSid)
      .update({ status: 'closed' })
      .then(interaction_channel_participant =>
        console.log(interaction_channel_participant)
      )

    // Create the webhook and update conversation attributes
    await client.conversations
      .conversations(conversationSid)
      .webhooks.create({
        'configuration.method': 'POST',
        'configuration.filters': ['onMessageAdded'],
        'configuration.url': CONVERSATIONS_WEBHOOK_URL,
        target: 'webhook'
      })
      .then(async webhook => {
        const webhookSid = webhook.sid
        const attributes = {
          interactionSid,
          channelSid,
          participantSid,
          taskSid,
          workflowSid,
          taskChannelUniqueName,
          targetSid,
          workerName,
          taskAttributes,
          webhookSid
        }

        await client.conversations
          .conversations(conversationSid)
          .update({ attributes: `${JSON.stringify(attributes)}` })
          .then(conversation => {
            console.log('conversation attributes updated')
            console.log(conversation)
          })
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
