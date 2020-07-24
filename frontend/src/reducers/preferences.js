const preferences = (state = {executionThresholdAbsolute: '', executionThresholdIdeal: ''}, action) => {
    switch (action.type) {
        case 'SET_PREFERENCES':
            return {executionThresholdAbsolute: action.value.executionThresholdAbsolute, 
                executionThresholdIdeal: action.value.executionThresholdIdeal}
        default:
            return state
    }
}

export default preferences