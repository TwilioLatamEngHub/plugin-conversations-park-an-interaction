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

const ParkButton = props => {
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

export default ParkButton

// import React from 'react'
// import { Actions, withTheme } from '@twilio/flex-ui'

// import { StyledButton } from './ParkButton.styles'

// export class ParkButton extends React.PureComponent {
//   constructor(props) {
//     super(props)
//     this.state = {
//       isDisabled: false,
//       cursor: 'pointer'
//     }
//   }

//   render() {
//     return (
//       <StyledButton
//         color={this.props.theme.tokens.textColors}
//         background={this.props.theme.tokens.backgroundColors}
//         disabled={this.state.isDisabled}
//         style={{ cursor: this.state.cursor }}
//         onClick={() => {
//           this.setState({ isDisabled: true })
//           this.setState({ cursor: 'not-allowed' })
//           Actions.invokeAction('ParkInteraction', { task: this.props.task })
//         }}
//       >
//         Pause
//       </StyledButton>
//     )
//   }
// }

// export default withTheme(ParkButton)
