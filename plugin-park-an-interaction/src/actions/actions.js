import { Actions, TaskHelper, Manager, Notifications } from '@twilio/flex-ui'
import fetch from 'node-fetch'
import {
  URL_PARK_AN_INTERACTION,
  URL_CLOSE_AN_INTERACTION
} from '../helpers/constants'

const parkInteraction = async (payload, original) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload)
  }

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

const closeInteraction = async (payload, original) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload)
  }

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

  const body = {
    channelSid: agent.channelSid,
    interactionSid: agent.interactionSid,
    conversationSid: agent.mediaProperties.conversationSid
  }

  try {
    fetch(URL_CLOSE_AN_INTERACTION, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
  } catch (error) {
    console.error(error)
  }
}

export const setUpActions = () => {
  Actions.registerAction('ParkInteraction', (payload, original) =>
    parkInteraction(payload, original)
  )
  Actions.registerAction('CloseInteraction', (payload, original) =>
    closeInteraction(payload, original)
  )
}
