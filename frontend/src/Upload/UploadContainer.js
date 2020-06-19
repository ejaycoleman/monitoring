import Upload from './Upload'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import gql from 'graphql-tag'

const createSingleTask = gql`
    mutation uploadSingleTask($number: Int!, $command: String!, $frequency: Int!, $period: Period!) {
        uploadSingleTask(number: $number, command: $command, frequency: $frequency, period: $period) {
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
            enabled
        }
    }
`

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
        enabled
    }
}
`

const UploadContainer =
    compose(
        graphql(createSingleTask, {
            props: ({ loading, mutate, ownProps}) => ({
                loading: loading || ownProps.loading,
                uploadSingleTask: ({number, command, frequency, period}) => {
                    if (command === '') {
                        throw new Error('Command must not be empty')
                    }
                    if (frequency === 0) {
                        throw new Error('Frequency must not be 0')
                    }
                    if (!['days', 'weeks', 'months'].includes(period)) {
                        throw new Error(`Period must be either 'days', 'weeks', or 'months'`)
                    }

                    return mutate({
                        variables: {
                            number: parseInt(number), 
                            command, 
                            frequency: parseInt(frequency), 
                            period
                        }
                    })
                }
            })
        }),
        graphql(retreiveTasks, {
			props: ({ data: { loading, tasks, refetch }, ownProps }) => {
				return ({
					tasks,
                    loading,
                    refetch
				})
			},
		})
    )(Upload)

export default UploadContainer