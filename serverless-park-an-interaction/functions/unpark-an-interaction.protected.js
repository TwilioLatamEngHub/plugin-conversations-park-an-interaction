const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient()
  const workspaceSid = context.WORKSPACE_SID

  const conversationSid = event.ConversationSid

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
