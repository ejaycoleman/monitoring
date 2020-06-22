import StatusRow from './StatusRow'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { toggleNotification, toggleEnabled } from '../../gql'

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