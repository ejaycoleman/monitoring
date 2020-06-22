import TaskSettingsModal from './TaskSettingsModal'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { modifyTask, removeTask } from '../../gql'

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