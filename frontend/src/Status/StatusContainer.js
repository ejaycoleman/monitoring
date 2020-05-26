import Status from './Status'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {flowRight as compose} from 'lodash'

const retreiveTasks = gql` {
    tasks {
        number,
        command, 
        frequency,
        period,
        executions {
            datetime
        },
        notifications {
            user {
                id
            }
        }
    }
}
`

const toggleNotification = gql`
    mutation toggleNotification($taskNumber: String!) {
        toggleNotification(taskNumber: $taskNumber) {
            user {
                isAdmin
            }
        }
    }
`

const StatusContainer =
    compose(
        graphql(retreiveTasks, {
            props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
                return ({
                    tasks,
                    loading,
                    subscribeToMore
                })
            },
        }),
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
    )(Status)

export default StatusContainer