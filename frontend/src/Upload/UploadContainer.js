import Upload from './Upload'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const uploadMutation = gql`
    mutation uploadTasksFile($tasks: String!) {
        uploadTasksFile(tasks: $tasks) {
            period
        }
    }
`

const CreateContainer =
    graphql(uploadMutation, {
        props: ({ loading, mutate, ownProps }) => ({
            loading: loading || ownProps.loading,
            uploadMutation: ({tasks}) => {
                return mutate({
                    variables: {
                        tasks
                    },
                    update: (cache, { data: { id } }) => {
                        console.log(id)
                    }
                })
            }
        })
    })(Upload)

export default CreateContainer