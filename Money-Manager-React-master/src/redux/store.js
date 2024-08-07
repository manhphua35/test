/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk' // Thử cách import khác
import userReducer from './reducers/userReducer'

const rootReducer = combineReducers({
  user: userReducer,
  // Thêm các reducers khác tại đây nếu cần
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store
