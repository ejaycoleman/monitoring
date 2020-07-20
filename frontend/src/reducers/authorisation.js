import {LOGIN_USER, LOGOUT_USER} from '../constants'

const authorisation = (state = {authed: false, admin: false, email: ''}, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {authed: true, admin: action.value.admin, email: action.value.email}
        case LOGOUT_USER:
            return {authed: false, admin: false, email: ''}
        default:
            return state
    }
}

export default authorisation