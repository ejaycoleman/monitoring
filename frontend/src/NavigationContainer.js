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
                    subscribeToMore
                })
            },
        }),
        graphql(currentUser, { 
            props: ({ data: { loading, currentUser}, ownProps}) => {
                return ({
                    currentUser
                })
            },
        })
    )(Navigation)

export default NavigationContainer