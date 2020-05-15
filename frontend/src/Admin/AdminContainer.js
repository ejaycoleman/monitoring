import Admin from './Admin'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import gql from 'graphql-tag'

const retreiveTasks = gql` {
    tasks(approved: false) {
        id,
        number,
        command, 
        frequency,
        period,
        author {
            email
        }
    }
}
`

const approveTaskMutation = gql`
    mutation approveTask($id: ID!) {
        approveTask(id: $id) {
            number,
            approved
        }
    }
`

const AdminContainer =
    compose(
        graphql(retreiveTasks, {
			props: ({ data: { loading, tasks }, ownProps }) => {
				return ({
					tasks,
					loading
				})
			},
        }),
        graphql(approveTaskMutation, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                approveTask: ({id}) => {
                    return mutate({
                        variables: {
                            id
                        }
                    })
                }
            })
        }),
    )(Admin)

export default AdminContainer