import StatusRow from './StatusRow'
import { graphql } from 'react-apollo'
import { toggleNotification, approveTaskMutation, removeTask } from '../../gql'
import { flowRight as compose } from 'lodash'

const StatusRowContainer =
    compose(
        graphql(toggleNotification, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                toggleNotification: (taskNumber) => {
                    return mutate({
                        variables: {
                            taskNumber
                        }
                    })
                }
            })
        }),
        graphql(approveTaskMutation, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                graphqlApproveTask: ({number}) => {
                    return mutate({
                        variables: {
                            number: parseInt(number)
                        }
                    })
                }
            })
        }),
        graphql(removeTask, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                removeTaskProp: (taskNumber) => {
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