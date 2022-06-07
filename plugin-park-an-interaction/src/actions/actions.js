import { Actions, TaskHelper, Manager } from '@twilio/flex-ui'
import fetch from 'node-fetch'
import {
  URL_PARK_AN_INTERACTION,
  URL_CLOSE_AN_INTERACTION,
  URL_UPDATE_A_CONVERSATION
} from '../helpers/constants'

const updateConversationAttributes = async (payload, original) => {
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

  return fetch(URL_UPDATE_A_CONVERSATION, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}

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

  return fetch(URL_PARK_AN_INTERACTION, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
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
    interactionSid: agent.interactionSid
  }

  return fetch(URL_CLOSE_AN_INTERACTION, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export const setUpActions = () => {
  Actions.registerAction('ParkInteraction', (payload, original) =>
    parkInteraction(payload, original)
  )
  Actions.registerAction('CloseInteraction', (payload, original) =>
    closeInteraction(payload, original)
  )
  Actions.registerAction('UpdateConversationAttributes', (payload, original) =>
    updateConversationAttributes(payload, original)
  )
}
