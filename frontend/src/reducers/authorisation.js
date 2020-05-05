const authorisation = (state = false, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return true
        case 'LOGOUT_USER':
            return false
        default:
            return state
    }
}

export default authorisation