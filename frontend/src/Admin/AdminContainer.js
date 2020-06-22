import Admin from './Admin'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import {retreiveDisapprovedTasks, approveTaskMutation, rejectTaskMutation} from '../gql'

const AdminContainer =
    compose(
        graphql(retreiveDisapprovedTasks, {
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
        })
    )(Admin)

export default AdminContainer