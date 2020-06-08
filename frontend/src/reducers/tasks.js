const tasks = (state = [], action) => {
    let tasks, existingTask
    switch (action.type) {
        case 'ADD_TASK':
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
            tasks = state.map(a => ({...a}))
            existingTask = tasks.findIndex(({number})=> number === action.value)

            if (existingTask === -1) {
                return state
            }

            tasks.splice(existingTask, 1)
            return tasks
        default:
            return state
    }
}

export default tasks