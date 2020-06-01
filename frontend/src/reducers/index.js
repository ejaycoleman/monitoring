import { combineReducers } from 'redux'
import authorisation from './authorisation'
import tasks from './tasks'

export default combineReducers({
    isLogged: authorisation,
    tasks
})