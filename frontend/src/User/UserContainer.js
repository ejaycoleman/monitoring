import User from './User'
import { graphql } from 'react-apollo'
import { userSetExecutionPreferences } from '../gql'
import { flowRight as compose } from 'lodash'

// Prepares the mutation for setting user preferences
const UserContainer =
    compose(
        graphql(userSetExecutionPreferences, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                setPreferences: (recieveEmailForLate, recieveEmailForNever, recieveEmailForRan) => {
                    return mutate({
                        variables: {
                            recieveEmailForLate,
                            recieveEmailForNever,
                            recieveEmailForRan
                        }
                    })
                }
            })
        })
    )(User)

export default UserContainer