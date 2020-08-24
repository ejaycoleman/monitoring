// gets task and user details so child components can access them

import Navigation from './Navigation'
import { graphql } from 'react-apollo'
import { retreiveTasks, currentUser } from './gql'
import { flowRight as compose } from 'lodash'

const NavigationContainer =
    compose(
        graphql(retreiveTasks, {
            props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
                return ({
                    tasks,
                    loading,
                    subscribeToMore // this allows a subscription to be initialised
                })
            },
        }),
        graphql(currentUser, { 
            props: ({ data: { currentUser, refetch}, ownProps}) => {
                return ({
                    currentUser,
                    refetch // provides a method to refetch information
                })
            },
        })
    )(Navigation)

export default NavigationContainer