import Login from './Login'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const loginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`

const CreateContainer =
    graphql(loginMutation, {
        props: ({ loading, mutate, ownProps }) => ({
            loading: loading || ownProps.loading,
            loginMutation: ({email, password}) => {
                return mutate({
                    variables: {
                        email: email,
                        password: password,
                    },
                    update: (cache, { data: { login } }) => {
                        localStorage.setItem('AUTH_TOKEN', login.token)   
                    }
                })
            }
        })
    })(Login)

export default CreateContainer