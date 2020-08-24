import { ADD_TASK, ADD_EXECUTION, MODIFY_TASK, REMOVE_TASK, RESET_TASKS, TOGGLE_TASK_ENABLED, APPROVE_TASK } from '../constants'

const tasks = (state = [], action) => {
    let tasks, existingTask
    switch (action.type) {
        case ADD_TASK:
            // return a new state containing the added task (or old state if the task already exists)
            if (state.filter(task => task.number === action.value.number).length !== 0) {
                return state
            }
            return [...state, action.value]
        case ADD_EXECUTION:
            // return a new state containing the added execution (or old state if the execution already exists)
            tasks = [...state]
            existingTask = tasks.find(({number})=> number === action.value.number)
            if (existingTask.executions.find(({datetime}) => datetime === action.value.execution)) {
                return state
            }
            existingTask.executions = [...existingTask.executions, {datetime: action.value.execution, __typename: "Execution"}]
            return tasks
        case MODIFY_TASK:
            // Reducer for when a user modifies a task
            tasks = state.map(a => ({...a}))
            existingTask = tasks.find(({number})=> number === action.value.number)

            if (existingTask.length === 0) {
                return state
            }
            existingTask.command = action.value.command
            existingTask.frequency = action.value.frequency
            existingTask.period = action.value.period
            existingTask.enabled = action.value.enabled
            existingTask.approved = action.value.approved
            return tasks
        case APPROVE_TASK:
            // Set task approved to true
            tasks = state.map(a => ({...a}))
            existingTask = tasks.find(({number})=> number === parseInt(action.value))
            if (existingTask.length === 0) {
                return state
            }
            existingTask.approved = true
            return tasks
        case REMOVE_TASK:
            // returns tasks excluding one to remove 
            return state.filter(({number}) => number !== action.value)
        case RESET_TASKS:
            return []
        case TOGGLE_TASK_ENABLED:
            // toggles enabled/disabled on tasks
            tasks = state.map(a => ({...a}))
            existingTask = tasks.find(({number})=> number === action.value.number)
            existingTask.enabled = action.value.enabled
            return tasks
        default:
            return state
    }
}

export default tasks