const preferences = (state = {executionThresholdAbsolute: '', executionThresholdIdeal: '', recieveEmailForLate: false, recieveEmailForNever: false, recieveEmailForRan: false}, action) => {
    switch (action.type) {
        case 'SET_PREFERENCES':
            return {
                executionThresholdAbsolute: action.value.executionThresholdAbsolute, 
                executionThresholdIdeal: action.value.executionThresholdIdeal, 
                recieveEmailForLate: action.value.recieveEmailForLate, 
                recieveEmailForNever: action.value.recieveEmailForNever, 
                recieveEmailForRan: action.value.recieveEmailForRan}
        default:
            return state
    }
}

export default preferences