import { combineReducers } from 'redux'
import authorisation from './authorisation'

export default combineReducers({
    isLogged : authorisation
})