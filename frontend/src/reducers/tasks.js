const tasks = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.value]
        default:
            return state
    }
}

export default tasks