exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()

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

  const attributes = {
    interactionSid,
    channelSid,
    participantSid,
    taskSid,
    workflowSid,
    taskChannelUniqueName,
    targetSid,
    workerName,
    taskAttributes
  }

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  try {
    await client.conversations
      .conversations(conversationSid)
      .update({ attributes: `${JSON.stringify(attributes)}` })
      .then(conversation => {
        console.log('conversation update')
        console.log(conversation)
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
