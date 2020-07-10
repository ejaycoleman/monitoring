import Admin from './Admin'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import {retreiveDisapprovedTasks, approveTaskMutation, rejectTaskMutation, usersUnapprovedTasks} from '../gql'

const AdminContainer =
    compose(
        graphql(retreiveDisapprovedTasks, {
			props: ({ data: { loading, tasks, refetch }, ownProps }) => {
				return ({
					tasks,
                    loading,
                    refetch
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
        graphql(rejectTaskMutation, {
            props: ({ loading, mutate, ownProps }) => ({
                loading: loading || ownProps.loading,
                rejectTask: ({id}) => {
                    return mutate({
                        variables: {
                            id
                        }
                    })
                }
            })
        }),
        graphql(usersUnapprovedTasks, {
			props: ({ data: { loading, tasks }, ownProps }) => {
				return ({
					tasks,
                    loading,
                    
				})
			},
        })
    )(Admin)

export default AdminContainer