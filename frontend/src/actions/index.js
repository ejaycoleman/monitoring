export const login = value => ({
    type: 'LOGIN_USER',
    value
})

export const logout = () => ({
    type: 'LOGOUT_USER'
})

export const addTask = value => ({
    type: 'ADD_TASK',
    value
})

export const addExecution = value => ({
    type: 'ADD_EXECUTION',
    value
})