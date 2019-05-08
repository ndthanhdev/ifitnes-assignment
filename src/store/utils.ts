import { createStore, applyMiddleware, compose } from 'redux'
import { reducer } from './reducer'
import thunk from 'redux-thunk'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const initStore = () => {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
}
