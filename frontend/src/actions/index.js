import { LOGIN_USER, LOGOUT_USER, ADD_TASK, ADD_EXECUTION, MODIFY_TASK, REMOVE_TASK, RESET_TASKS, TOGGLE_TASK_ENABLED, APPROVE_TASK } from '../constants'

export const login = value => ({
    type: LOGIN_USER,
    value
})

export const logout = () => ({
    type: LOGOUT_USER
})

export const addTask = value => ({
    type: ADD_TASK,
    value
})

export const addExecution = value => ({
    type: ADD_EXECUTION,
    value
})

export const modifyTask = value => ({
    type: MODIFY_TASK,
    value
})

export const approveTask = value => ({
    type: APPROVE_TASK,
    value
})

export const removeTask = value => ({
    type: REMOVE_TASK,
    value
})

export const resetTasks = () => ({
    type: RESET_TASKS
})

export const toggleTaskEnabled = value => ({
    type: TOGGLE_TASK_ENABLED,
    value
})