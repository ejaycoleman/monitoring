const tasks = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.value]
        case 'ADD_EXECUTION':
            let tasks = [...state]
            const existingTask = tasks.find(({number})=> number === action.value.number)
            if (existingTask.executions.find(({datetime}) => datetime === action.value.execution)) {
                return state
            }
            existingTask.executions = [...existingTask.executions, {datetime: action.value.execution, __typename: "Execution"}]
            return tasks
        default:
            return state
    }
}

export default tasks