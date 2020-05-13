import Upload from './Upload'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import gql from 'graphql-tag'

const uploadFileMutation = gql`
    mutation uploadTasksFile($tasks: String!) {
        uploadTasksFile(tasks: $tasks) {
            number,
            command,
            frequency,
            period
        }
    }
`

const createSingleTask = gql`
    mutation uploadSingleTask($number: Int!, $command: String!, $frequency: Int!, $period: String!) {
        uploadSingleTask(number: $number, command: $command, frequency: $frequency, period: $period) {
            number,
            command,
            frequency,
            period
        }
    }
`

const retreiveTasks = gql` {
    tasks {
        number,
        command, 
        frequency,
        period
    }
}
`

const UploadContainer =
    compose(
        graphql(uploadFileMutation, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                uploadMutation: ({tasks}) => {
                    return mutate({
                        variables: {
                            tasks
                        }
                    })
                }
            })
        }),
        graphql(createSingleTask, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                uploadSingleTask: ({number, command, frequency, period}) => {
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
			props: ({ data: { loading, tasks }, ownProps }) => {
				return ({
					tasks,
					loading
				})
			},
		})
    )(Upload)

export default UploadContainer