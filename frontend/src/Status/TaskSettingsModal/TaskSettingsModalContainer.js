import TaskSettingsModal from './TaskSettingsModal'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { flowRight as compose } from 'lodash'

const modifyTask = gql`
    mutation modifyTask($number: Int!, $command: String, $frequency: Int, $period: Period) {
        modifyTask(number: $number, command: $command, frequency: $frequency, period: $period) {
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

const removeTask = gql`
    mutation removeTask($taskNumber: Int!) {
        removeTask(taskNumber: $taskNumber) {
            number
        }
    }
`

const TaskSettingsModalContainer =
    compose(
        graphql(modifyTask, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                modifyTask: (number, command, frequency, period) => {
                    return mutate({
                        variables: {
                            number: parseInt(number),
                            command,
                            frequency: parseInt(frequency),
                            period
                        }
                    })
                }
            })
        }),
        graphql(removeTask, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                removeTask: (taskNumber) => {
                    return mutate({
                        variables: {
                            taskNumber: parseInt(taskNumber)
                        }
                    })
                }
            })
        }),
    )(TaskSettingsModal)

export default TaskSettingsModalContainer