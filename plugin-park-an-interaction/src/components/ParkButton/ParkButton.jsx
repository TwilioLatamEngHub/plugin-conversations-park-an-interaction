import React from 'react'
import { Actions, withTheme } from '@twilio/flex-ui'

import { StyledButton } from './ParkButton.styles'

// eslint-disable-next-line import/no-unused-modules
export class ParkButton extends React.PureComponent {
  render() {
    return (
      <StyledButton
        color={this.props.theme.tokens.textColors}
        background={this.props.theme.tokens.backgroundColors}
        onClick={() =>
          Actions.invokeAction('ParkInteraction', { task: this.props.task })
        }
      >
        Pause
      </StyledButton>
    )
  }
}

// eslint-disable-next-line import/no-unused-modules
export default withTheme(ParkButton)
