import Status from './Status'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { retreiveTasks, userExecutionPreferences, userSetExecutionPreferences } from '../gql'

const StatusContainer =
    compose(
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
        })
    )(Status)

export default StatusContainer