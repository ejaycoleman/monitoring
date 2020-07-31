import Upload from './Upload'
import { graphql } from 'react-apollo'
import { userSetExecutionPreferences } from '../gql'

const UserContainer =
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
    })(Upload)

export default UserContainer