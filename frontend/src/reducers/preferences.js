// Redux reducers for the state referring to preferences

import {SET_PREFERENCES, LOGOUT_USER} from '../constants'

const preferences = (state = {executionThresholdAbsolute: '', executionThresholdIdeal: '', receiveEmailForLate: false, receiveEmailForNever: false, receiveEmailForRan: false}, action) => {
    switch (action.type) {
        case SET_PREFERENCES:
            // Set preferences for a user
            return {
                executionThresholdAbsolute: action.value.executionThresholdAbsolute !== undefined ? action.value.executionThresholdAbsolute : state.executionThresholdAbsolute, 
                executionThresholdIdeal: action.value.executionThresholdIdeal !== undefined ? action.value.executionThresholdIdeal : state.executionThresholdIdeal, 
                receiveEmailForLate: action.value.receiveEmailForLate !== undefined ? action.value.receiveEmailForLate : state.receiveEmailForLate, 
                receiveEmailForNever: action.value.receiveEmailForNever !== undefined ? action.value.receiveEmailForNever : state.receiveEmailForNever, 
                receiveEmailForRan: action.value.receiveEmailForRan !== undefined ? action.value.receiveEmailForRan : state.receiveEmailForRan}
        case LOGOUT_USER:
            // this resets a users preferences when they logout
            return {
                executionThresholdAbsolute: '', 
                executionThresholdIdeal: '', 
                receiveEmailForLate: false, 
                receiveEmailForNever: false, 
                receiveEmailForRan: false
            }
        default:
            return state
    }
}

export default preferences