import React, { useState } from 'react'
import styled from 'styled-components'
import { Actions } from '@twilio/flex-ui'

import { PauseIcon } from '@twilio-paste/icons/esm/PauseIcon'
import { Theme } from '@twilio-paste/core/theme'
import { Spinner } from '@twilio-paste/core/spinner'

const IconWrapper = styled.div`
  margin: 0.8rem;
  color: #fff;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
`

export const ParkButton = props => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Theme.Provider theme='default'>
      {isLoading ? (
        <IconWrapper isLoading={isLoading}>
          <Spinner size='sizeIcon40' decorative={false} title='Loading' />
        </IconWrapper>
      ) : (
        <IconWrapper
          onClick={() => {
            setIsLoading(true)
            Actions.invokeAction('ParkInteraction', { task: props.task })
          }}
        >
          <PauseIcon
            decorative={false}
            title='Pause Interaction'
            size='sizeIcon40'
          />
        </IconWrapper>
      )}
    </Theme.Provider>
  )
}
