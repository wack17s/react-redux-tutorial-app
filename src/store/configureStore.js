import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../modules/reducer'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk' // <-- добавили redux-thunk


export default function configureStore(initialState) {
  const logger = createLogger()
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)) // <-- добавили его в цепочку перед logger'ом

  if (module.hot) {
    module.hot.accept('../modules/reducer', () => {
      const nextRootReducer = require('../modules/reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}