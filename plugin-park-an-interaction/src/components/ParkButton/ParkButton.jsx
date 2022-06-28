import React, { useState } from 'react'
import styled from 'styled-components'
import { Actions } from '@twilio/flex-ui'

import { Button } from '@twilio-paste/core/button'
import { Theme } from '@twilio-paste/core/theme'

const ButtonWrapper = styled.div`
  margin: 1rem;
  font-size: 1rem;
  color: #fff;
`

export const ParkButton = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [cursor, setCursor] = useState('pointer')

  return (
    <Theme.Provider theme='default'>
      <ButtonWrapper>
        <Button
          variant='reset'
          size='reset'
          loading={isLoading}
          style={{ cursor: cursor }}
          onClick={() => {
            setIsLoading(true)
            setCursor('not-allowed')
            Actions.invokeAction('ParkInteraction', { task: props.task })
          }}
        >
          Pause
        </Button>
      </ButtonWrapper>
    </Theme.Provider>
  )
}
