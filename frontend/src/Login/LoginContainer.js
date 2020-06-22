import Login from './Login'
import { graphql } from 'react-apollo'
import { loginMutation } from '../gql'

const CreateContainer =
    graphql(loginMutation, {
        props: ({ loading, mutate, ownProps }) => ({
            loading: loading || ownProps.loading,
            loginMutation: ({email, password}) => {
                return mutate({
                    variables: {
                        email: email,
                        password: password,
                    }
                })
            }
        })
    })(Login)

export default CreateContainer