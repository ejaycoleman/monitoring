import Status from './Status'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const retreiveTasks = gql` {
    tasks {
        number,
        command, 
        frequency,
        period,
        executions {
            datetime
        }
    }
}
`

const StatusContainer =
    graphql(retreiveTasks, {
        props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
            return ({
                tasks,
                loading,
                subscribeToMore
            })
        },
    })(Status)

export default StatusContainer