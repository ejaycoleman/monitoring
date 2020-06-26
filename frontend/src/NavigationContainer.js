import Navigation from './Navigation'
import { graphql } from 'react-apollo'
import { retreiveTasks } from './gql'

const NavigationContainer =
    graphql(retreiveTasks, {
        props: ({ data: { loading, tasks, subscribeToMore }, ownProps }) => {
            return ({
                tasks,
                loading,
                subscribeToMore
            })
        },
    })(Navigation)

export default NavigationContainer