import TaskSettingsModal from './TaskSettingsModal'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { modifyTask, removeTask } from '../../gql'

const TaskSettingsModalContainer =
    compose(
        graphql(modifyTask, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                modifyTask: (number, command, frequency, period, enabled) => {
                    if (!Number.isInteger(parseInt(number)) || number <= 0) {
                        throw new Error(`Task number (${number}) must be a positive integer`)
                    }
                    if (command === '') {
                        throw new Error(`task #${number}: command is empty`)
                    }
                    if (!Number.isInteger(parseInt(frequency)) || frequency <= 0) {
                        throw new Error(`task #${number}: frequency should be positive integer`)
                    }
                    if (!['days', 'weeks', 'months'].includes(period)) {
                        throw new Error(`task #${number}: invalid period '${period}'`)
                    }
                    return mutate({
                        variables: {
                            number: parseInt(number),
                            command,
                            frequency: parseInt(frequency),
                            period,
                            enabled
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