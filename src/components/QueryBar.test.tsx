import { create } from 'react-test-renderer'
import { QueryBar } from './QueryBar'
import React from 'react'

it('render', () => {
  const component = create(<QueryBar />)

  const tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
