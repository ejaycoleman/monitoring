import StatusRow from './StatusRow'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { flowRight as compose } from 'lodash'

const toggleNotification = gql`
    mutation toggleNotification($taskNumber: String!) {
        toggleNotification(taskNumber: $taskNumber) {
            user {
                isAdmin
            }
        }
    }
`

const toggleEnabled = gql`
    mutation toggleEnabled($taskNumber: Int!) {
        toggleEnabled(taskNumber: $taskNumber) {
            number
        }
    }
`

const StatusRowContainer =
compose(
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
    }),
    graphql(toggleEnabled, {
        props: ({ loading, mutate, ownProps }) => ({
            loading: loading || ownProps.loading,
            toggleEnabled: (taskNumber) => {
                return mutate({
                    variables: {
                        taskNumber: parseInt(taskNumber)
                    }
                })
            }
        })
    }),
)(StatusRow)

export default StatusRowContainer