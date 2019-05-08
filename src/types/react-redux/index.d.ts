import * as origin from 'react-redux'

declare module 'react-redux' {
  export * from origin

  /**
   * A hook to access the redux `dispatch` function. Note that in most cases where you
   * might want to use this hook it is recommended to use `useActions` instead to bind
   * action creators to the `dispatch` function.
   *
   * @returns redux store's `dispatch` function
   *
   * @example
   *
   * import React, { useCallback } from 'react'
   * import { useDispatch } from 'react-redux'
   *
   * export const CounterComponent = ({ value }) => {
   *   const dispatch = useDispatch()
   *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
   *   return (
   *     <div>
   *       <span>{value}</span>
   *       <button onClick={increaseCounter}>Increase counter</button>
   *     </div>
   *   )
   * }
   */
  export function useDispatch<A extends Action = any>(): Dispatch<A>

  /**
   * A hook to access the redux store's state. This hook takes a selector function
   * as an argument. The selector is called with the store state.
   *
   * This hook takes a dependencies array as an optional second argument, which
   * when passed ensures referential stability of the selector (this is primarily
   * useful if you provide a selector that memoizes values).
   *
   * @param selector the selector function
   * @param deps (optional) dependencies array to control referential stability
   * of the selector
   *
   * @returns the selected state
   *
   * @example
   *
   * import React from 'react'
   * import { useSelector } from 'react-redux'
   * import { RootState } from './store'
   *
   * export const CounterComponent = () => {
   *   const counter = useSelector((state: RootState) => state.counter, [])
   *   return <div>{counter}</div>
   * }
   */
  export function useSelector<TState, TSelected>(
    selector: (state: TState) => TSelected,
    deps?: ReadonlyArray<any>
  ): TSelected

  /**
   * A hook to access the redux store.
   *
   * @returns the redux store
   *
   * @example
   *
   * import React from 'react'
   * import { useStore } from 'react-redux'
   *
   * export const ExampleComponent = () => {
   *   const store = useStore()
   *   return <div>{store.getState()}</div>
   * }
   */
  export function useStore<S = any, A extends Action = AnyAction>(): Store<S, A>
}
