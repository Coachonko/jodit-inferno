# jodit-inferno

Inferno wrapper for Jodit WYSIWYG editor.

Requires Inferno JSX

## Usage

```
import { Component, createRef } from 'inferno'

import JoditEditor from './JoditEditor'

class NewPage extends Component {
  constructor (props) {
    super(props)

    this.editor = createRef()
    this.state = {
      value: ''
    }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleBlur (newValue) {
    this.setState({ value: newValue })
  }

  handleClick () {
    if (this.editor.current) {
      console.log(this.state.value)
    }
  }

  render () {
    return (
      <div>
        <button type='button' onClick={this.handleClick}>log</button>
        <JoditEditor ref={this.editor} value={this.state.value} onBlur={this.handleBlur} />
      </div>
    )
  }
}

export default NewPage
```