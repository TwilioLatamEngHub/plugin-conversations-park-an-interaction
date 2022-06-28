exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()
  const workspaceSid = context.WORKSPACE_SID

  const conversationSid = event.ConversationSid

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  try {
    // Fetch the conversation attributes updated when parked
    const {
      interactionSid,
      channelSid,
      taskAttributes,
      taskChannelUniqueName,
      webhookSid,
      workflowSid
    } = await client.conversations
      .conversations(conversationSid)
      .fetch()
      .then(convo => {
        const attributes = JSON.parse(convo.attributes)
        return {
          interactionSid: attributes.interactionSid,
          channelSid: attributes.channelSid,
          taskAttributes: attributes.taskAttributes,
          taskChannelUniqueName: attributes.taskChannelUniqueName,
          webhookSid: attributes.webhookSid,
          workflowSid: attributes.workflowSid
        }
      })

    // Remove webhook so it doesn't keep triggering if parked more than once
    await client.conversations
      .conversations(conversationSid)
      .webhooks(webhookSid)
      .remove()

    // Create a new task through the invites endpoint. Alternatively you can pass
    // a queue_sid and a worker_sid inside properties to add a specific agent back to the interation
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: {
          properties: {
            workspace_sid: workspaceSid,
            workflow_sid: workflowSid,
            task_channel_unique_name: taskChannelUniqueName,
            attributes: taskAttributes
          }
        }
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
