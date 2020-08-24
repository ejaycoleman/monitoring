import {SET_PREFERENCES, LOGOUT_USER} from '../constants'

const preferences = (state = {executionThresholdAbsolute: '', executionThresholdIdeal: '', recieveEmailForLate: false, recieveEmailForNever: false, recieveEmailForRan: false}, action) => {
    switch (action.type) {
        case SET_PREFERENCES:
            // Set preferences for a user
            return {
                executionThresholdAbsolute: action.value.executionThresholdAbsolute !== undefined ? action.value.executionThresholdAbsolute : state.executionThresholdAbsolute, 
                executionThresholdIdeal: action.value.executionThresholdIdeal !== undefined ? action.value.executionThresholdIdeal : state.executionThresholdIdeal, 
                recieveEmailForLate: action.value.recieveEmailForLate !== undefined ? action.value.recieveEmailForLate : state.recieveEmailForLate, 
                recieveEmailForNever: action.value.recieveEmailForNever !== undefined ? action.value.recieveEmailForNever : state.recieveEmailForNever, 
                recieveEmailForRan: action.value.recieveEmailForRan !== undefined ? action.value.recieveEmailForRan : state.recieveEmailForRan}
        case LOGOUT_USER:
            // this resets a users preferences when they logout
            return {
                executionThresholdAbsolute: '', 
                executionThresholdIdeal: '', 
                recieveEmailForLate: false, 
                recieveEmailForNever: false, 
                recieveEmailForRan: false
            }
        default:
            return state
    }
}

export default preferences