import Upload from './Upload'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { createSingleTask, retreiveTasks } from '../gql'

// Props for creating and retrieving tasks
const UploadContainer =
    compose(
        graphql(createSingleTask, {
            props: ({ loading, mutate, ownProps}) => ({
                loading: loading || ownProps.loading,
                uploadSingleTask: ({number, command, frequency, period}) => {
                    if (!Number.isInteger(parseInt(number)) || number <= 0) {
                        throw new Error(`Task number (${number}) must be a positive integer`)
                    }
                    if (command === '') {
                        throw new Error(`task #${number}: command is empty`)
                    }
                    if (!Number.isInteger(parseInt(frequency)) || frequency <= 0) {
                        throw new Error(`task #${number}: frequency should be positive integer`)
                    }
                    if (!['days', 'weeks', 'months'].includes(period)) {
                        throw new Error(`task #${number}: invalid period '${period}'`)
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
                    refetch,
				})
			},
		})
    )(Upload)

export default UploadContainer