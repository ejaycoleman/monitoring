// Provides the props for toggling notifications on tasks and approving tasks (for admins)

import StatusRow from './StatusRow'
import { graphql } from 'react-apollo'
import { toggleNotification, approveTaskMutation } from '../../gql'
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
        })
    )(StatusRow)

export default StatusRowContainer