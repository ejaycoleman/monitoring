import StatusRow from './StatusRow'
import { graphql } from 'react-apollo'
import { toggleNotification } from '../../gql'

const StatusRowContainer =
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
    })(StatusRow)

export default StatusRowContainer