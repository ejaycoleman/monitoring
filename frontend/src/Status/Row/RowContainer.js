import Row from './Row'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const toggleNotification = gql`
    mutation toggleNotification($taskNumber: String!) {
        toggleNotification(taskNumber: $taskNumber) {
            user {
                isAdmin
            }
        }
    }
`

const RowContainer =
    graphql(toggleNotification, {
        props: ({ loading, mutate, ownProps }) => ({
            loading: loading || ownProps.loading,
            toggleNotification: (taskNumber) => {
                console.log("ENABLING")
                return mutate({
                    variables: {
                        taskNumber
                    }
                })
            }
        })
    })(Row)

export default RowContainer