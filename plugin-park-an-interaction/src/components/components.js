import * as Flex from '@twilio/flex-ui'
import React from 'react'

import ParkButton from './ParkButton/ParkButton'

/**
 * This appends new content to the Chat Canvas (adds Pause button near end chat button)
 *
 * The if: property here is important, this says only add the Pause button if this is CBM-like task
 * and the task has been assigned.
 */
export const setUpComponents = () => {
  Flex.TaskCanvasHeader.Content.add(
    <ParkButton key='conversation-park-button' />,
    {
      sortOrder: 1,
      if: props =>
        props.channelDefinition.capabilities.has('Chat') &&
        props.task.taskStatus === 'assigned'
    }
  )
}
