import React from 'react'
import { FlexPlugin } from '@twilio/flex-plugin'

import { setUpActions } from './actions/actions'
import { setUpComponents } from './components/components'

const PLUGIN_NAME = 'ConversationsParkAnInteractionPlugin'

export default class ConversationsParkAnInteractionPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    setUpComponents()
    setUpActions()

    flex.Actions.addListener('beforeCompleteTask', task => {
      flex.Actions.invokeAction('CloseInteraction', { task: task.task })
    })
  }
}
