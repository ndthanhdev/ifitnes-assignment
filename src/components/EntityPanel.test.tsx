import { EntityPanel } from './EntityPanel'
import { IState, initialState } from '../store/reducer'
import { initStore } from '../store/utils'
import { Provider } from 'react-redux'
import { ITickerEntity } from '../interfaces/Entity'
import React from 'react'
import { mount } from 'enzyme'
import { SideList } from './SideList'
import { StockPriceChart } from './StockPriceChart'
import { defineMockMatchMedia } from '../utils/test'

const initState: IState = {
  input: '',
  entities: [
    {
      type: 'TickerEntity',
      tickerSymbol: 'aSymbol',
      operator: '>',
      base: 100,
    },
  ],
  stockPriceMap: {
    aSymbol: {
      name: 'a Company',
      tickerSymbol: 'aSymbol',
      prices: [
        { date: '2018-03-27', close: 100 },
        { date: '2018-03-26', close: 99 },
        { date: '2018-03-25', close: 100 },
        { date: '2018-03-24', close: 101 },
        { date: '2018-03-23', close: 102 },
        { date: '2018-03-22', close: 90 },
        { date: '2018-03-21', close: 100 },
      ],
    },
  },
}

const store = initStore(initialState)
const entity: ITickerEntity = {
  type: 'TickerEntity',
  tickerSymbol: 'aSymbol',
  operator: '>',
  base: 100,
}

test('render on wide screen', () => {
  defineMockMatchMedia(true)

  const component = mount(
    <Provider store={store}>
      <EntityPanel entity={entity} />
    </Provider>
  )

  expect(component.find(StockPriceChart).length).toEqual(1)
  expect(component.find(SideList).length).toEqual(1)
})

test('render on small screen', () => {
  defineMockMatchMedia(false)

  const component = mount(
    <Provider store={store}>
      <EntityPanel entity={entity} />
    </Provider>
  )

  expect(component.find(StockPriceChart).length).toEqual(1)
  expect(component.find(SideList).length).toEqual(0)

  component
    .find({ label: 'Close Prices' })
    .first()
    .simulate('click')

  expect(component.find(StockPriceChart).length).toEqual(0)
  expect(component.find(SideList).length).toEqual(1)
})
