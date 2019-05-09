import { createStore, applyMiddleware, compose, DeepPartial } from 'redux'
import { reducer, IState } from './reducer'
import thunk from 'redux-thunk'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const initStore = (preloadedState?: DeepPartial<IState>) => {
  return createStore(
    reducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
  )
}
