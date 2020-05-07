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
        props: ({ data: { loading, tasks }, ownProps }) => {
            return ({
                tasks,
                loading
            })
        },
    })(Status)

export default StatusContainer