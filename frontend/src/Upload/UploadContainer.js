import Upload from './Upload'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import gql from 'graphql-tag'

const uploadMutation = gql`
    mutation uploadTasksFile($tasks: String!) {
        uploadTasksFile(tasks: $tasks) {
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
        graphql(uploadMutation, {
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