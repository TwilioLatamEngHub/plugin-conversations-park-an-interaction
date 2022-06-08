import React from 'react'
import { Actions, withTheme } from '@twilio/flex-ui'

import { StyledButton } from './ParkButton.styles'

export class ParkButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isDisabled: false,
      cursor: 'pointer'
    }
  }

  render() {
    return (
      <StyledButton
        color={this.props.theme.tokens.textColors}
        background={this.props.theme.tokens.backgroundColors}
        disabled={this.state.isDisabled}
        style={{ cursor: this.state.cursor }}
        onClick={() => {
          this.setState({ isDisabled: true })
          this.setState({ cursor: 'not-allowed' })
          Actions.invokeAction('ParkInteraction', { task: this.props.task })
        }}
      >
        Pause
      </StyledButton>
    )
  }
}

export default withTheme(ParkButton)
