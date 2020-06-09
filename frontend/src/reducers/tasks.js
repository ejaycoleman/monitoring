const tasks = (state = [], action) => {
    let tasks, existingTask
    switch (action.type) {
        case 'ADD_TASK':
            if (state.filter(task => task.number === action.value.number).length !== 0) {
                return state
            }
            return [...state, action.value]
        case 'ADD_EXECUTION':
            tasks = [...state]
            existingTask = tasks.find(({number})=> number === action.value.number)
            if (existingTask.executions.find(({datetime}) => datetime === action.value.execution)) {
                return state
            }
            existingTask.executions = [...existingTask.executions, {datetime: action.value.execution, __typename: "Execution"}]
            return tasks
        case 'MODIFY_TASK':
            tasks = state.map(a => ({...a}))
            existingTask = tasks.find(({number})=> number === action.value.number)

            if (existingTask.length === 0) {
                return state
            }
            existingTask.command = action.value.command
            existingTask.frequency = action.value.frequency
            existingTask.period = action.value.period
            return tasks
        case 'REMOVE_TASK':
            return state.filter(({number}) => number !== action.value)
        case 'RESET_TASKS':
            return []
        default:
            return state
    }
}

export default tasks