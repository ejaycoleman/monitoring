export const login = isAdmin => ({
    type: 'LOGIN_USER',
    value: isAdmin
})

export const logout = () => ({
    type: 'LOGOUT_USER'
})