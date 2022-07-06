import { Actions, TaskHelper, Manager, Notifications } from '@twilio/flex-ui'
import fetch from 'node-fetch'

const URL_PARK_AN_INTERACTION = process.env.FLEX_APP_URL_PARK_AN_INTERACTION

const getAgent = async payload => {
  const participants = await payload.task.getParticipants(
    payload.task.attributes.flexInteractionChannelSid
  )

  let agent
  for (const p of participants) {
    if (p.type === 'agent') {
      agent = p
      break
    }
  }

  return agent
}

const parkInteraction = async (payload, original) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload)
  }

  const agent = await getAgent(payload)

  const manager = Manager.getInstance()
  const body = {
    channelSid: agent.channelSid,
    interactionSid: agent.interactionSid,
    participantSid: agent.participantSid,
    conversationSid: agent.mediaProperties.conversationSid,
    taskSid: payload.task.taskSid,
    workflowSid: payload.task.workflowSid,
    taskChannelUniqueName: payload.task.taskChannelUniqueName,
    targetSid: payload.targetSid,
    workerName: manager.user.identity,
    taskAttributes: payload.task.attributes
  }

  try {
    await fetch(URL_PARK_AN_INTERACTION, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })

    return Notifications.showNotification('parkedNotification')
  } catch (error) {
    console.error(error)

    return Notifications.showNotification('errorParkedNotification')
  }
}

Actions.registerAction('ParkInteraction', (payload, original) =>
  parkInteraction(payload, original)
)
