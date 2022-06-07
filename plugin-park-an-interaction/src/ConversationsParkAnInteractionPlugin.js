import React from 'react'
import { VERSION } from '@twilio/flex-ui'
import { FlexPlugin } from '@twilio/flex-plugin'

import reducers, { namespace } from './states'
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
    this.registerReducers(manager)
    setUpComponents()
    setUpActions()

    flex.Actions.addListener('afterAcceptTask', task => {
      flex.Actions.invokeAction('UpdateConversationAttributes', {
        task: task.task
      })
    })

    flex.Actions.addListener('beforeCompleteTask', task => {
      flex.Actions.invokeAction('CloseInteraction', { task: task.task })
    })
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      )
      return
    }

    manager.store.addReducer(namespace, reducers)
  }
}
