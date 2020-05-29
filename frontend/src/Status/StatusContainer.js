import Status from './Status'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {flowRight as compose} from 'lodash'

const retreiveTasks = gql` {
    tasks {
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

const userExecutionPreferences = gql` {
    currentUser {
        preference {
            executionThresholdIdeal,
            executionThresholdAbsolute
        }
    }
}`

// const userSetExecutionPreferences = gql`{
//     mutation setPreferences($idealFrequency: Int!, $idealPeriod: String!, $absoluteFrequency: Int!, $absolutePeriod: String!) {
//         setPreferences(idealFrequency: $idealFrequency, idealPeriod: $idealPeriod, absoluteFrequency: $absoluteFrequency, absolutePeriod: $absolutePeriod) {
//             forUser {
//                 email
//             }
//         }
//     }
// }`

const StatusContainer =

    compose(
        graphql(retreiveTasks, {
            props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
                return ({
                    tasks,
                    loading,
                    subscribeToMore
                })
            },
        }),
        graphql(userExecutionPreferences, {
            props: ({ data: { loading, currentUser }, ownProps }) => {
                return ({
                    userPreferences: currentUser,
                    loading,
                })
            },
        })        
    )(Status)

export default StatusContainer