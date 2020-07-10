import gql from 'graphql-tag'

export const retrieveExecutionsSubscription = gql`
    subscription {
        newExecution {
            datetime,
            task {
                number
            }
        }
    }
`

export const taskDeletedSubscription = gql`
    subscription {
        taskDeleted {
			number
		}
    }
`

export const retreiveTasks = gql` {
    tasks {
        number,
        command, 
        frequency,
        period,
        executions {
            datetime
        },
        notifications {
            user {
                id
            }
        }
        enabled
    }
}
`

export const usersUnapprovedTasks = gql` {
    usersUnapprovedTasks {
        number,
        command,
        frequency,
        period
    }
}`

export const retreiveDisapprovedTasks = gql` {
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

export const userExecutionPreferences = gql` {
    currentUser {
        preference {
            executionThresholdIdeal,
            executionThresholdAbsolute
        }
    }
}`

export const userSetExecutionPreferences = gql`
    mutation setPreferences($idealFrequency: String!, $idealPeriod: String!, $absoluteFrequency: String!, $absolutePeriod: String!) {
        setPreferences(idealFrequency: $idealFrequency, idealPeriod: $idealPeriod, absoluteFrequency: $absoluteFrequency, absolutePeriod: $absolutePeriod) {
            forUser {
                email,
            },
            executionThresholdIdeal,
            executionThresholdAbsolute
        }
    }
`


export const createSingleTask = gql`
    mutation uploadSingleTask($number: Int!, $command: String!, $frequency: Int!, $period: Period!) {
        uploadSingleTask(number: $number, command: $command, frequency: $frequency, period: $period) {
            number,
            command,
            frequency,
            period,
            executions {
            datetime
            },
            notifications {
                user {
                    id
                }
            }
            enabled
        }
    }
`

export const modifyTask = gql`
    mutation modifyTask($number: Int!, $command: String, $frequency: Int, $period: Period, $enabled: Boolean) {
        modifyTask(number: $number, command: $command, frequency: $frequency, period: $period, enabled: $enabled) {
            number,
            command,
            frequency,
            period,
            executions {
            datetime
            },
            notifications {
                user {
                    id
                }
            }
            enabled
        }
    }
`

export const removeTask = gql`
    mutation removeTask($taskNumber: Int!) {
        removeTask(taskNumber: $taskNumber) {
            number
        }
    }
`

export const toggleNotification = gql`
    mutation toggleNotification($taskNumber: String!) {
        toggleNotification(taskNumber: $taskNumber) {
            user {
                isAdmin
            }
        }
    }
`

export const approveTaskMutation = gql`
    mutation approveTask($id: ID!) {
        approveTask(id: $id) {
            number,
            command,
            frequency,
            period,
            executions {
            datetime
            },
            notifications {
                user {
                    id
                }
            }
            enabled
        }
    }
`

export const rejectTaskMutation = gql`
    mutation rejectTask($id: ID!) {
        rejectTask(id: $id) {
            number
        }
    }
`

export const loginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token,
            user {
                isAdmin
            }
        }
    }
`