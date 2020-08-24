import Navigation from './Navigation'
import { graphql } from 'react-apollo'
import { retreiveTasks, currentUser } from './gql'
import { flowRight as compose } from 'lodash'

// gets task and user details so child components can access them
const NavigationContainer =
    compose(
        graphql(retreiveTasks, {
            props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
                return ({
                    tasks,
                    loading,
                    subscribeToMore
                })
            },
        }),
        graphql(currentUser, { 
            props: ({ data: { currentUser, refetch}, ownProps}) => {
                return ({
                    currentUser,
                    refetch
                })
            },
        })
    )(Navigation)

export default NavigationContainer