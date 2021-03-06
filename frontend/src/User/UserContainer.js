// Prepares the mutation for setting user preferences

import User from './User'
import { graphql } from 'react-apollo'
import { userSetExecutionPreferences } from '../gql'
import { flowRight as compose } from 'lodash'

const UserContainer =
    compose(
        graphql(userSetExecutionPreferences, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                setPreferences: (receiveEmailForLate, receiveEmailForNever, receiveEmailForRan) => {
                    return mutate({
                        variables: {
                            receiveEmailForLate,
                            receiveEmailForNever,
                            receiveEmailForRan
                        }
                    })
                }
            })
        })
    )(User)

export default UserContainer