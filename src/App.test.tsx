import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { defineMockMatchMedia } from './utils/test'

it('renders without crashing', () => {
  defineMockMatchMedia(true)

  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
