declare module 'react-quill' {
  import { Component } from 'react'

  export interface ReactQuillProps {
    value?: string
    defaultValue?: string
    onChange?: (content: string, delta: any, source: string, editor: any) => void
    placeholder?: string
    readOnly?: boolean
    theme?: string
    modules?: any
    formats?: string[]
    bounds?: string | HTMLElement
    debug?: boolean | string
    preserveWhitespace?: boolean
    scrollingContainer?: string | HTMLElement
    tabIndex?: number
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}

