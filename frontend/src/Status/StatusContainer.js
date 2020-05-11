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

const retrieveTasksSubscription = gql`
    subscription {
        newExecution {
            number,
            datetime
        }
    }
`

const StatusContainer =
    graphql(retreiveTasks, {
        props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
            // console.log(subscribeToMore)
            subscribeToMore({
                document: retrieveTasksSubscription,
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev
                    const newExecution = subscriptionData.data.newExecution
                    const exists = prev.tasks.find(({number})=> number === newExecution.number)
                    exists && exists.executions.push(newExecution.datetime)
                    return exists
                }
            })
            return ({
                tasks,
                loading
            })
        },
    })(Status)

export default StatusContainer