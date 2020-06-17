import {LOGIN_USER, LOGOUT_USER} from '../constants'

const authorisation = (state = {authed: false, admin: false}, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {authed: true, admin: action.value}
        case LOGOUT_USER:
            return {authed: false, admin: false}
        default:
            return state
    }
}

export default authorisation