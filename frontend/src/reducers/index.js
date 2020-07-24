import { combineReducers } from 'redux'
import authorisation from './authorisation'
import tasks from './tasks'
import preferences from './preferences'

export default combineReducers({
    isLogged: authorisation,
    tasks,
    preferences
})