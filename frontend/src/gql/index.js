// All the GraphQL payload objects

import gql from 'graphql-tag'

// new executions subscription
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

// task deletion subscription
export const taskDeletedSubscription = gql`
    subscription {
        taskDeleted {
			number
		}
    }
`

// query to get all tasks
export const retreiveTasks = gql` {
    tasks {
        number,
        command, 
        frequency,
        period,
        approved,
        executions {
            datetime
        },
        notifications {
            user {
                id
            }
        }
        enabled,
        author {
            email
        }
    }
}
`

// mutation for setting user preferences for recent execution thresholds
export const userSetExecutionPreferences = gql`
    mutation setPreferences($idealFrequency: String, $idealPeriod: String, $absoluteFrequency: String, $absolutePeriod: String, $receiveEmailForLate: Boolean, $receiveEmailForNever: Boolean, $receiveEmailForRan: Boolean) {
        setPreferences(idealFrequency: $idealFrequency, idealPeriod: $idealPeriod, absoluteFrequency: $absoluteFrequency, absolutePeriod: $absolutePeriod, receiveEmailForLate: $receiveEmailForLate, receiveEmailForNever: $receiveEmailForNever, receiveEmailForRan: $receiveEmailForRan) {
            executionThresholdIdeal,
            executionThresholdAbsolute,
            receiveEmailForLate,
            receiveEmailForNever,
            receiveEmailForRan
        }
    }
`

// mutation for creating a task
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
            enabled,
            author {
                email
            },
            approved
        }
    }
`

// mutation for modifyig a task
export const modifyTask = gql`
    mutation modifyTask($number: Int!, $command: String, $frequency: Int, $period: Period, $enabled: Boolean) {
        modifyTask(number: $number, command: $command, frequency: $frequency, period: $period, enabled: $enabled) {
            number,
            command,
            frequency,
            period,
            enabled,
            approved,
            executions {
            datetime
            },
            notifications {
                user {
                    id
                }
            }
        }
    }
`

// mutation for removing a task
export const removeTask = gql`
    mutation removeTask($taskNumber: Int!) {
        removeTask(taskNumber: $taskNumber) {
            number
        }
    }
`

// mutation for setting notifications for a task
export const toggleNotification = gql`
    mutation toggleNotification($taskNumber: String!) {
        toggleNotification(taskNumber: $taskNumber) {
            user {
                isAdmin
            }
        }
    }
`

// mutation for an admin approving a task
export const approveTaskMutation = gql`
    mutation approveTask($number: Int!) {
        approveTask(number: $number) {
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

// mutation for logging a user in
export const loginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token,
            user {
                isAdmin,
                email,
                preference {
                    executionThresholdIdeal,
                    executionThresholdAbsolute,
                    receiveEmailForLate,
                    receiveEmailForNever,
                    receiveEmailForRan
                }
            }
        }
    }
`

// retrieve details about current user
export const currentUser = gql`
    {
        currentUser {
            isAdmin,
            email,
            preference {
                executionThresholdIdeal,
                executionThresholdAbsolute,
                receiveEmailForLate,
                receiveEmailForNever,
                receiveEmailForRan
            }
        }
    }
`