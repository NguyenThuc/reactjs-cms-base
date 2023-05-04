import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import userReducer from './reducers'

const initialState = {
  sidebarShow: true,
}

const middleware = [thunk]

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const rootReducers = combineReducers({
  userReducer: userReducer,
  changeState: changeState,
})

const store = createStore(rootReducers, composeWithDevTools(applyMiddleware(...middleware)))
export default store
