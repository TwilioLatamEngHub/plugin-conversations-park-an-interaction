const axios = require('axios')
const FormData = require('form-data')

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()
  const INTERACTIONS_URL = context.INTERACTIONS_URL
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

    const inviteUrl = `${INTERACTIONS_URL}/${interactionSid}/Channels/${channelSid}/Invites`

    const routingBody = `{"type":"TaskRouter",
    "properties":{
      "workspace_sid":"${workspaceSid}",
      "workflow_sid":"${workflowSid}",
      "task_channel_unique_name": "${taskChannelUniqueName}",
      "attributes": ${JSON.stringify(taskAttributes)} } }`

    const formData = new FormData()
    formData.append('Routing', routingBody)

    await axios({
      method: 'post',
      url: inviteUrl,
      data: formData,
      headers: formData.getHeaders(),
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN
      }
    })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
