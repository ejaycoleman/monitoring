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

const userSetExecutionPreferences = gql`
    mutation setPreferences($idealFrequency: String!, $idealPeriod: String!, $absoluteFrequency: String!, $absolutePeriod: String!) {
        setPreferences(idealFrequency: $idealFrequency, idealPeriod: $idealPeriod, absoluteFrequency: $absoluteFrequency, absolutePeriod: $absolutePeriod) {
            forUser {
                email,
            },
            executionThresholdIdeal,
            executionThresholdAbsolute
        }
    }
`

const StatusContainer =
    compose(
        graphql(retreiveTasks, {
            props: ({ data: { loading, tasks, subscribeToMore, refetch }, ownProps }) => {
                return ({
                    tasks,
                    loading,
                    subscribeToMore,
                    refetch
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
        }),
        graphql(userSetExecutionPreferences, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                setPreferences: (idealFrequency, idealPeriod, absoluteFrequency, absolutePeriod) => {
                    return mutate({
                        variables: {
                            idealFrequency, 
                            idealPeriod, 
                            absoluteFrequency, 
                            absolutePeriod
                        },
                        update: (cache, { data: {setPreferences}}) => {
                            const { currentUser } = cache.readQuery({ query: userExecutionPreferences })
                            currentUser.preference.executionThresholdIdeal = setPreferences.executionThresholdIdeal
                            currentUser.preference.executionThresholdAbsolute = setPreferences.executionThresholdAbsolute
                            cache.writeQuery({
                                query: userExecutionPreferences,
                                data: {currentUser: {preference: {executionThresholdIdeal: setPreferences.executionThresholdIdeal, executionThresholdAbsolute: setPreferences.executionThresholdAbsolute, ...currentUser.preference}, ...currentUser}}
                            })
                        }
                    })
                }
            })
        }),
    )(Status)

export default StatusContainer