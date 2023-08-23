import { Component, createRef } from 'inferno'
import { Jodit } from 'jodit'
import 'jodit/build/jodit.min.css'

const { isFunction } = Jodit.modules.Helpers

// Expects props:
// ref: RefObject
// className: string,
// config: object,
// id: string,
// name: string,
// onBlur: func,
// editorRef: func,
// tabIndex: number,
// value: string
export default class JoditEditor extends Component {
  constructor (props) {
    super(props)
    this.textArea = createRef()
    this.preClassName = null

    this.handleBlur = this.handleBlur.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount () {
    const { ref, config, editorRef } = this.props
    const element = this.textArea.current

    const jodit = Jodit.make(element, config)
    this.textArea.current = jodit

    jodit.events.on('blur', this.handleBlur)
    jodit.events.on('input', this.handleInput)

    if (isFunction(editorRef)) {
      editorRef(jodit)
    }

    if (isFunction(ref)) {
      ref(element)
    } else if (ref) {
      ref.current = element
    }

    this.cleanup = () => {
      if (jodit) {
        jodit.events.off('blur', this.handleBlur)
        jodit.events.off('input', this.handleInput)
        jodit.destruct()
      }

      this.textArea.current = element
    }
  }

  componentWillUnmount () {
    if (this.cleanup) {
      this.cleanup()
    }
  }

  componentDidUpdate (prevProps) {
    const { className } = this.props
    const classList = this.textArea.current?.container?.classList

    if (
      this.preClassName !== className && typeof this.preClassName === 'string'
    ) {
      this.preClassName.split(/\s+/).forEach(cl => classList?.remove(cl))
    }

    if (className && typeof className === 'string') {
      className.split(/\s+/).forEach(cl => classList?.add(cl))
    }

    this.preClassName = className

    if (this.textArea.current.workplace) {
      this.textArea.current.workplace.tabIndex = this.props.tabIndex || -1
    }

    if (
      (!this.textArea.current.events || (!this.props.onBlur && !this.props.onInput)) &&
      (!this.textArea.current.events) &&
      (prevProps.onBlur || prevProps.onInput)
    ) {
      this.textArea.current?.events
        ?.off('blur', this.handleBlur)
        .off('input', this.handleInput)
    }

    if ((this.props.onBlur || this.props.onInput) && !prevProps.onBlur && !prevProps.onInput) {
      this.textArea.current?.events
        ?.on('blur', this.handleBlur)
        .on('input', this.handleInput)
    }

    if (this.textArea.current && this.textArea?.current?.value !== this.props.value) {
      this.textArea.current.value = this.props.value
    }
  }

  handleBlur (e) {
    if (this.props.onBlur) {
      this.props.onBlur(this.textArea.current.value)
    }
  }

  handleInput (value) {
    if (this.props.onInput) {
      this.props.onInput(value)
    }
  }

  render () {
    return (
      <div className='jodit-container'>
        <textarea name={this.props.name} id={this.props.id} ref={this.textArea} />
      </div>
    )
  }
}

JoditEditor.displayName = 'JoditEditor'
