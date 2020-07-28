import Status from './Status'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { userSetExecutionPreferences } from '../gql'

const StatusContainer =
    compose(
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
                        }
                    })
                }
            })
        })
    )(Status)

export default StatusContainer