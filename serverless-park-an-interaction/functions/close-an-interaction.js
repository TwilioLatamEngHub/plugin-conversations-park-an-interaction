exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response()

  const client = context.getTwilioClient()

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  try {
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
