module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.10). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateExecution {
  count: Int!
}

type AggregatePreference {
  count: Int!
}

type AggregateTask {
  count: Int!
}

type AggregateTaskNotification {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Execution {
  id: ID!
  task: Task!
  datetime: Int!
}

type ExecutionConnection {
  pageInfo: PageInfo!
  edges: [ExecutionEdge]!
  aggregate: AggregateExecution!
}

input ExecutionCreateInput {
  id: ID
  task: TaskCreateOneWithoutExecutionsInput!
  datetime: Int!
}

input ExecutionCreateManyWithoutTaskInput {
  create: [ExecutionCreateWithoutTaskInput!]
  connect: [ExecutionWhereUniqueInput!]
}

input ExecutionCreateWithoutTaskInput {
  id: ID
  datetime: Int!
}

type ExecutionEdge {
  node: Execution!
  cursor: String!
}

enum ExecutionOrderByInput {
  id_ASC
  id_DESC
  datetime_ASC
  datetime_DESC
}

type ExecutionPreviousValues {
  id: ID!
  datetime: Int!
}

input ExecutionScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  datetime: Int
  datetime_not: Int
  datetime_in: [Int!]
  datetime_not_in: [Int!]
  datetime_lt: Int
  datetime_lte: Int
  datetime_gt: Int
  datetime_gte: Int
  AND: [ExecutionScalarWhereInput!]
  OR: [ExecutionScalarWhereInput!]
  NOT: [ExecutionScalarWhereInput!]
}

type ExecutionSubscriptionPayload {
  mutation: MutationType!
  node: Execution
  updatedFields: [String!]
  previousValues: ExecutionPreviousValues
}

input ExecutionSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ExecutionWhereInput
  AND: [ExecutionSubscriptionWhereInput!]
  OR: [ExecutionSubscriptionWhereInput!]
  NOT: [ExecutionSubscriptionWhereInput!]
}

input ExecutionUpdateInput {
  task: TaskUpdateOneRequiredWithoutExecutionsInput
  datetime: Int
}

input ExecutionUpdateManyDataInput {
  datetime: Int
}

input ExecutionUpdateManyMutationInput {
  datetime: Int
}

input ExecutionUpdateManyWithoutTaskInput {
  create: [ExecutionCreateWithoutTaskInput!]
  delete: [ExecutionWhereUniqueInput!]
  connect: [ExecutionWhereUniqueInput!]
  set: [ExecutionWhereUniqueInput!]
  disconnect: [ExecutionWhereUniqueInput!]
  update: [ExecutionUpdateWithWhereUniqueWithoutTaskInput!]
  upsert: [ExecutionUpsertWithWhereUniqueWithoutTaskInput!]
  deleteMany: [ExecutionScalarWhereInput!]
  updateMany: [ExecutionUpdateManyWithWhereNestedInput!]
}

input ExecutionUpdateManyWithWhereNestedInput {
  where: ExecutionScalarWhereInput!
  data: ExecutionUpdateManyDataInput!
}

input ExecutionUpdateWithoutTaskDataInput {
  datetime: Int
}

input ExecutionUpdateWithWhereUniqueWithoutTaskInput {
  where: ExecutionWhereUniqueInput!
  data: ExecutionUpdateWithoutTaskDataInput!
}

input ExecutionUpsertWithWhereUniqueWithoutTaskInput {
  where: ExecutionWhereUniqueInput!
  update: ExecutionUpdateWithoutTaskDataInput!
  create: ExecutionCreateWithoutTaskInput!
}

input ExecutionWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  task: TaskWhereInput
  datetime: Int
  datetime_not: Int
  datetime_in: [Int!]
  datetime_not_in: [Int!]
  datetime_lt: Int
  datetime_lte: Int
  datetime_gt: Int
  datetime_gte: Int
  AND: [ExecutionWhereInput!]
  OR: [ExecutionWhereInput!]
  NOT: [ExecutionWhereInput!]
}

input ExecutionWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createExecution(data: ExecutionCreateInput!): Execution!
  updateExecution(data: ExecutionUpdateInput!, where: ExecutionWhereUniqueInput!): Execution
  updateManyExecutions(data: ExecutionUpdateManyMutationInput!, where: ExecutionWhereInput): BatchPayload!
  upsertExecution(where: ExecutionWhereUniqueInput!, create: ExecutionCreateInput!, update: ExecutionUpdateInput!): Execution!
  deleteExecution(where: ExecutionWhereUniqueInput!): Execution
  deleteManyExecutions(where: ExecutionWhereInput): BatchPayload!
  createPreference(data: PreferenceCreateInput!): Preference!
  updatePreference(data: PreferenceUpdateInput!, where: PreferenceWhereUniqueInput!): Preference
  updateManyPreferences(data: PreferenceUpdateManyMutationInput!, where: PreferenceWhereInput): BatchPayload!
  upsertPreference(where: PreferenceWhereUniqueInput!, create: PreferenceCreateInput!, update: PreferenceUpdateInput!): Preference!
  deletePreference(where: PreferenceWhereUniqueInput!): Preference
  deleteManyPreferences(where: PreferenceWhereInput): BatchPayload!
  createTask(data: TaskCreateInput!): Task!
  updateTask(data: TaskUpdateInput!, where: TaskWhereUniqueInput!): Task
  updateManyTasks(data: TaskUpdateManyMutationInput!, where: TaskWhereInput): BatchPayload!
  upsertTask(where: TaskWhereUniqueInput!, create: TaskCreateInput!, update: TaskUpdateInput!): Task!
  deleteTask(where: TaskWhereUniqueInput!): Task
  deleteManyTasks(where: TaskWhereInput): BatchPayload!
  createTaskNotification(data: TaskNotificationCreateInput!): TaskNotification!
  updateTaskNotification(data: TaskNotificationUpdateInput!, where: TaskNotificationWhereUniqueInput!): TaskNotification
  upsertTaskNotification(where: TaskNotificationWhereUniqueInput!, create: TaskNotificationCreateInput!, update: TaskNotificationUpdateInput!): TaskNotification!
  deleteTaskNotification(where: TaskNotificationWhereUniqueInput!): TaskNotification
  deleteManyTaskNotifications(where: TaskNotificationWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Preference {
  id: ID!
  forUser: User!
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

type PreferenceConnection {
  pageInfo: PageInfo!
  edges: [PreferenceEdge]!
  aggregate: AggregatePreference!
}

input PreferenceCreateInput {
  id: ID
  forUser: UserCreateOneWithoutPreferenceInput!
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

input PreferenceCreateOneWithoutForUserInput {
  create: PreferenceCreateWithoutForUserInput
  connect: PreferenceWhereUniqueInput
}

input PreferenceCreateWithoutForUserInput {
  id: ID
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

type PreferenceEdge {
  node: Preference!
  cursor: String!
}

enum PreferenceOrderByInput {
  id_ASC
  id_DESC
  executionThresholdIdeal_ASC
  executionThresholdIdeal_DESC
  executionThresholdAbsolute_ASC
  executionThresholdAbsolute_DESC
}

type PreferencePreviousValues {
  id: ID!
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

type PreferenceSubscriptionPayload {
  mutation: MutationType!
  node: Preference
  updatedFields: [String!]
  previousValues: PreferencePreviousValues
}

input PreferenceSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PreferenceWhereInput
  AND: [PreferenceSubscriptionWhereInput!]
  OR: [PreferenceSubscriptionWhereInput!]
  NOT: [PreferenceSubscriptionWhereInput!]
}

input PreferenceUpdateInput {
  forUser: UserUpdateOneRequiredWithoutPreferenceInput
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

input PreferenceUpdateManyMutationInput {
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

input PreferenceUpdateOneWithoutForUserInput {
  create: PreferenceCreateWithoutForUserInput
  update: PreferenceUpdateWithoutForUserDataInput
  upsert: PreferenceUpsertWithoutForUserInput
  delete: Boolean
  disconnect: Boolean
  connect: PreferenceWhereUniqueInput
}

input PreferenceUpdateWithoutForUserDataInput {
  executionThresholdIdeal: String
  executionThresholdAbsolute: String
}

input PreferenceUpsertWithoutForUserInput {
  update: PreferenceUpdateWithoutForUserDataInput!
  create: PreferenceCreateWithoutForUserInput!
}

input PreferenceWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  forUser: UserWhereInput
  executionThresholdIdeal: String
  executionThresholdIdeal_not: String
  executionThresholdIdeal_in: [String!]
  executionThresholdIdeal_not_in: [String!]
  executionThresholdIdeal_lt: String
  executionThresholdIdeal_lte: String
  executionThresholdIdeal_gt: String
  executionThresholdIdeal_gte: String
  executionThresholdIdeal_contains: String
  executionThresholdIdeal_not_contains: String
  executionThresholdIdeal_starts_with: String
  executionThresholdIdeal_not_starts_with: String
  executionThresholdIdeal_ends_with: String
  executionThresholdIdeal_not_ends_with: String
  executionThresholdAbsolute: String
  executionThresholdAbsolute_not: String
  executionThresholdAbsolute_in: [String!]
  executionThresholdAbsolute_not_in: [String!]
  executionThresholdAbsolute_lt: String
  executionThresholdAbsolute_lte: String
  executionThresholdAbsolute_gt: String
  executionThresholdAbsolute_gte: String
  executionThresholdAbsolute_contains: String
  executionThresholdAbsolute_not_contains: String
  executionThresholdAbsolute_starts_with: String
  executionThresholdAbsolute_not_starts_with: String
  executionThresholdAbsolute_ends_with: String
  executionThresholdAbsolute_not_ends_with: String
  AND: [PreferenceWhereInput!]
  OR: [PreferenceWhereInput!]
  NOT: [PreferenceWhereInput!]
}

input PreferenceWhereUniqueInput {
  id: ID
}

type Query {
  execution(where: ExecutionWhereUniqueInput!): Execution
  executions(where: ExecutionWhereInput, orderBy: ExecutionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Execution]!
  executionsConnection(where: ExecutionWhereInput, orderBy: ExecutionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ExecutionConnection!
  preference(where: PreferenceWhereUniqueInput!): Preference
  preferences(where: PreferenceWhereInput, orderBy: PreferenceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Preference]!
  preferencesConnection(where: PreferenceWhereInput, orderBy: PreferenceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PreferenceConnection!
  task(where: TaskWhereUniqueInput!): Task
  tasks(where: TaskWhereInput, orderBy: TaskOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Task]!
  tasksConnection(where: TaskWhereInput, orderBy: TaskOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): TaskConnection!
  taskNotification(where: TaskNotificationWhereUniqueInput!): TaskNotification
  taskNotifications(where: TaskNotificationWhereInput, orderBy: TaskNotificationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [TaskNotification]!
  taskNotificationsConnection(where: TaskNotificationWhereInput, orderBy: TaskNotificationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): TaskNotificationConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  execution(where: ExecutionSubscriptionWhereInput): ExecutionSubscriptionPayload
  preference(where: PreferenceSubscriptionWhereInput): PreferenceSubscriptionPayload
  task(where: TaskSubscriptionWhereInput): TaskSubscriptionPayload
  taskNotification(where: TaskNotificationSubscriptionWhereInput): TaskNotificationSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type Task {
  id: ID!
  author: User
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
  executions(where: ExecutionWhereInput, orderBy: ExecutionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Execution!]
  notifications(where: TaskNotificationWhereInput, orderBy: TaskNotificationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [TaskNotification!]
}

type TaskConnection {
  pageInfo: PageInfo!
  edges: [TaskEdge]!
  aggregate: AggregateTask!
}

input TaskCreateInput {
  id: ID
  author: UserCreateOneWithoutTasksInput
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
  executions: ExecutionCreateManyWithoutTaskInput
  notifications: TaskNotificationCreateManyWithoutTaskInput
}

input TaskCreateManyWithoutAuthorInput {
  create: [TaskCreateWithoutAuthorInput!]
  connect: [TaskWhereUniqueInput!]
}

input TaskCreateOneWithoutExecutionsInput {
  create: TaskCreateWithoutExecutionsInput
  connect: TaskWhereUniqueInput
}

input TaskCreateOneWithoutNotificationsInput {
  create: TaskCreateWithoutNotificationsInput
  connect: TaskWhereUniqueInput
}

input TaskCreateWithoutAuthorInput {
  id: ID
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
  executions: ExecutionCreateManyWithoutTaskInput
  notifications: TaskNotificationCreateManyWithoutTaskInput
}

input TaskCreateWithoutExecutionsInput {
  id: ID
  author: UserCreateOneWithoutTasksInput
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
  notifications: TaskNotificationCreateManyWithoutTaskInput
}

input TaskCreateWithoutNotificationsInput {
  id: ID
  author: UserCreateOneWithoutTasksInput
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
  executions: ExecutionCreateManyWithoutTaskInput
}

type TaskEdge {
  node: Task!
  cursor: String!
}

type TaskNotification {
  id: ID!
  user: User
  task: Task
}

type TaskNotificationConnection {
  pageInfo: PageInfo!
  edges: [TaskNotificationEdge]!
  aggregate: AggregateTaskNotification!
}

input TaskNotificationCreateInput {
  id: ID
  user: UserCreateOneWithoutNotificationsInput
  task: TaskCreateOneWithoutNotificationsInput
}

input TaskNotificationCreateManyWithoutTaskInput {
  create: [TaskNotificationCreateWithoutTaskInput!]
  connect: [TaskNotificationWhereUniqueInput!]
}

input TaskNotificationCreateManyWithoutUserInput {
  create: [TaskNotificationCreateWithoutUserInput!]
  connect: [TaskNotificationWhereUniqueInput!]
}

input TaskNotificationCreateWithoutTaskInput {
  id: ID
  user: UserCreateOneWithoutNotificationsInput
}

input TaskNotificationCreateWithoutUserInput {
  id: ID
  task: TaskCreateOneWithoutNotificationsInput
}

type TaskNotificationEdge {
  node: TaskNotification!
  cursor: String!
}

enum TaskNotificationOrderByInput {
  id_ASC
  id_DESC
}

type TaskNotificationPreviousValues {
  id: ID!
}

input TaskNotificationScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  AND: [TaskNotificationScalarWhereInput!]
  OR: [TaskNotificationScalarWhereInput!]
  NOT: [TaskNotificationScalarWhereInput!]
}

type TaskNotificationSubscriptionPayload {
  mutation: MutationType!
  node: TaskNotification
  updatedFields: [String!]
  previousValues: TaskNotificationPreviousValues
}

input TaskNotificationSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: TaskNotificationWhereInput
  AND: [TaskNotificationSubscriptionWhereInput!]
  OR: [TaskNotificationSubscriptionWhereInput!]
  NOT: [TaskNotificationSubscriptionWhereInput!]
}

input TaskNotificationUpdateInput {
  user: UserUpdateOneWithoutNotificationsInput
  task: TaskUpdateOneWithoutNotificationsInput
}

input TaskNotificationUpdateManyWithoutTaskInput {
  create: [TaskNotificationCreateWithoutTaskInput!]
  delete: [TaskNotificationWhereUniqueInput!]
  connect: [TaskNotificationWhereUniqueInput!]
  set: [TaskNotificationWhereUniqueInput!]
  disconnect: [TaskNotificationWhereUniqueInput!]
  update: [TaskNotificationUpdateWithWhereUniqueWithoutTaskInput!]
  upsert: [TaskNotificationUpsertWithWhereUniqueWithoutTaskInput!]
  deleteMany: [TaskNotificationScalarWhereInput!]
}

input TaskNotificationUpdateManyWithoutUserInput {
  create: [TaskNotificationCreateWithoutUserInput!]
  delete: [TaskNotificationWhereUniqueInput!]
  connect: [TaskNotificationWhereUniqueInput!]
  set: [TaskNotificationWhereUniqueInput!]
  disconnect: [TaskNotificationWhereUniqueInput!]
  update: [TaskNotificationUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [TaskNotificationUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [TaskNotificationScalarWhereInput!]
}

input TaskNotificationUpdateWithoutTaskDataInput {
  user: UserUpdateOneWithoutNotificationsInput
}

input TaskNotificationUpdateWithoutUserDataInput {
  task: TaskUpdateOneWithoutNotificationsInput
}

input TaskNotificationUpdateWithWhereUniqueWithoutTaskInput {
  where: TaskNotificationWhereUniqueInput!
  data: TaskNotificationUpdateWithoutTaskDataInput!
}

input TaskNotificationUpdateWithWhereUniqueWithoutUserInput {
  where: TaskNotificationWhereUniqueInput!
  data: TaskNotificationUpdateWithoutUserDataInput!
}

input TaskNotificationUpsertWithWhereUniqueWithoutTaskInput {
  where: TaskNotificationWhereUniqueInput!
  update: TaskNotificationUpdateWithoutTaskDataInput!
  create: TaskNotificationCreateWithoutTaskInput!
}

input TaskNotificationUpsertWithWhereUniqueWithoutUserInput {
  where: TaskNotificationWhereUniqueInput!
  update: TaskNotificationUpdateWithoutUserDataInput!
  create: TaskNotificationCreateWithoutUserInput!
}

input TaskNotificationWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  user: UserWhereInput
  task: TaskWhereInput
  AND: [TaskNotificationWhereInput!]
  OR: [TaskNotificationWhereInput!]
  NOT: [TaskNotificationWhereInput!]
}

input TaskNotificationWhereUniqueInput {
  id: ID
}

enum TaskOrderByInput {
  id_ASC
  id_DESC
  approved_ASC
  approved_DESC
  number_ASC
  number_DESC
  command_ASC
  command_DESC
  frequency_ASC
  frequency_DESC
  period_ASC
  period_DESC
}

type TaskPreviousValues {
  id: ID!
  approved: Boolean
  number: Int!
  command: String!
  frequency: Int!
  period: String!
}

input TaskScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  approved: Boolean
  approved_not: Boolean
  number: Int
  number_not: Int
  number_in: [Int!]
  number_not_in: [Int!]
  number_lt: Int
  number_lte: Int
  number_gt: Int
  number_gte: Int
  command: String
  command_not: String
  command_in: [String!]
  command_not_in: [String!]
  command_lt: String
  command_lte: String
  command_gt: String
  command_gte: String
  command_contains: String
  command_not_contains: String
  command_starts_with: String
  command_not_starts_with: String
  command_ends_with: String
  command_not_ends_with: String
  frequency: Int
  frequency_not: Int
  frequency_in: [Int!]
  frequency_not_in: [Int!]
  frequency_lt: Int
  frequency_lte: Int
  frequency_gt: Int
  frequency_gte: Int
  period: String
  period_not: String
  period_in: [String!]
  period_not_in: [String!]
  period_lt: String
  period_lte: String
  period_gt: String
  period_gte: String
  period_contains: String
  period_not_contains: String
  period_starts_with: String
  period_not_starts_with: String
  period_ends_with: String
  period_not_ends_with: String
  AND: [TaskScalarWhereInput!]
  OR: [TaskScalarWhereInput!]
  NOT: [TaskScalarWhereInput!]
}

type TaskSubscriptionPayload {
  mutation: MutationType!
  node: Task
  updatedFields: [String!]
  previousValues: TaskPreviousValues
}

input TaskSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: TaskWhereInput
  AND: [TaskSubscriptionWhereInput!]
  OR: [TaskSubscriptionWhereInput!]
  NOT: [TaskSubscriptionWhereInput!]
}

input TaskUpdateInput {
  author: UserUpdateOneWithoutTasksInput
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
  executions: ExecutionUpdateManyWithoutTaskInput
  notifications: TaskNotificationUpdateManyWithoutTaskInput
}

input TaskUpdateManyDataInput {
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
}

input TaskUpdateManyMutationInput {
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
}

input TaskUpdateManyWithoutAuthorInput {
  create: [TaskCreateWithoutAuthorInput!]
  delete: [TaskWhereUniqueInput!]
  connect: [TaskWhereUniqueInput!]
  set: [TaskWhereUniqueInput!]
  disconnect: [TaskWhereUniqueInput!]
  update: [TaskUpdateWithWhereUniqueWithoutAuthorInput!]
  upsert: [TaskUpsertWithWhereUniqueWithoutAuthorInput!]
  deleteMany: [TaskScalarWhereInput!]
  updateMany: [TaskUpdateManyWithWhereNestedInput!]
}

input TaskUpdateManyWithWhereNestedInput {
  where: TaskScalarWhereInput!
  data: TaskUpdateManyDataInput!
}

input TaskUpdateOneRequiredWithoutExecutionsInput {
  create: TaskCreateWithoutExecutionsInput
  update: TaskUpdateWithoutExecutionsDataInput
  upsert: TaskUpsertWithoutExecutionsInput
  connect: TaskWhereUniqueInput
}

input TaskUpdateOneWithoutNotificationsInput {
  create: TaskCreateWithoutNotificationsInput
  update: TaskUpdateWithoutNotificationsDataInput
  upsert: TaskUpsertWithoutNotificationsInput
  delete: Boolean
  disconnect: Boolean
  connect: TaskWhereUniqueInput
}

input TaskUpdateWithoutAuthorDataInput {
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
  executions: ExecutionUpdateManyWithoutTaskInput
  notifications: TaskNotificationUpdateManyWithoutTaskInput
}

input TaskUpdateWithoutExecutionsDataInput {
  author: UserUpdateOneWithoutTasksInput
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
  notifications: TaskNotificationUpdateManyWithoutTaskInput
}

input TaskUpdateWithoutNotificationsDataInput {
  author: UserUpdateOneWithoutTasksInput
  approved: Boolean
  number: Int
  command: String
  frequency: Int
  period: String
  executions: ExecutionUpdateManyWithoutTaskInput
}

input TaskUpdateWithWhereUniqueWithoutAuthorInput {
  where: TaskWhereUniqueInput!
  data: TaskUpdateWithoutAuthorDataInput!
}

input TaskUpsertWithoutExecutionsInput {
  update: TaskUpdateWithoutExecutionsDataInput!
  create: TaskCreateWithoutExecutionsInput!
}

input TaskUpsertWithoutNotificationsInput {
  update: TaskUpdateWithoutNotificationsDataInput!
  create: TaskCreateWithoutNotificationsInput!
}

input TaskUpsertWithWhereUniqueWithoutAuthorInput {
  where: TaskWhereUniqueInput!
  update: TaskUpdateWithoutAuthorDataInput!
  create: TaskCreateWithoutAuthorInput!
}

input TaskWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  author: UserWhereInput
  approved: Boolean
  approved_not: Boolean
  number: Int
  number_not: Int
  number_in: [Int!]
  number_not_in: [Int!]
  number_lt: Int
  number_lte: Int
  number_gt: Int
  number_gte: Int
  command: String
  command_not: String
  command_in: [String!]
  command_not_in: [String!]
  command_lt: String
  command_lte: String
  command_gt: String
  command_gte: String
  command_contains: String
  command_not_contains: String
  command_starts_with: String
  command_not_starts_with: String
  command_ends_with: String
  command_not_ends_with: String
  frequency: Int
  frequency_not: Int
  frequency_in: [Int!]
  frequency_not_in: [Int!]
  frequency_lt: Int
  frequency_lte: Int
  frequency_gt: Int
  frequency_gte: Int
  period: String
  period_not: String
  period_in: [String!]
  period_not_in: [String!]
  period_lt: String
  period_lte: String
  period_gt: String
  period_gte: String
  period_contains: String
  period_not_contains: String
  period_starts_with: String
  period_not_starts_with: String
  period_ends_with: String
  period_not_ends_with: String
  executions_every: ExecutionWhereInput
  executions_some: ExecutionWhereInput
  executions_none: ExecutionWhereInput
  notifications_every: TaskNotificationWhereInput
  notifications_some: TaskNotificationWhereInput
  notifications_none: TaskNotificationWhereInput
  AND: [TaskWhereInput!]
  OR: [TaskWhereInput!]
  NOT: [TaskWhereInput!]
}

input TaskWhereUniqueInput {
  id: ID
  number: Int
}

type User {
  id: ID!
  isAdmin: Boolean!
  email: String!
  password: String!
  tasks(where: TaskWhereInput, orderBy: TaskOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Task!]
  notifications(where: TaskNotificationWhereInput, orderBy: TaskNotificationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [TaskNotification!]
  preference: Preference
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  isAdmin: Boolean
  email: String!
  password: String!
  tasks: TaskCreateManyWithoutAuthorInput
  notifications: TaskNotificationCreateManyWithoutUserInput
  preference: PreferenceCreateOneWithoutForUserInput
}

input UserCreateOneWithoutNotificationsInput {
  create: UserCreateWithoutNotificationsInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutPreferenceInput {
  create: UserCreateWithoutPreferenceInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutTasksInput {
  create: UserCreateWithoutTasksInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutNotificationsInput {
  id: ID
  isAdmin: Boolean
  email: String!
  password: String!
  tasks: TaskCreateManyWithoutAuthorInput
  preference: PreferenceCreateOneWithoutForUserInput
}

input UserCreateWithoutPreferenceInput {
  id: ID
  isAdmin: Boolean
  email: String!
  password: String!
  tasks: TaskCreateManyWithoutAuthorInput
  notifications: TaskNotificationCreateManyWithoutUserInput
}

input UserCreateWithoutTasksInput {
  id: ID
  isAdmin: Boolean
  email: String!
  password: String!
  notifications: TaskNotificationCreateManyWithoutUserInput
  preference: PreferenceCreateOneWithoutForUserInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  isAdmin_ASC
  isAdmin_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
}

type UserPreviousValues {
  id: ID!
  isAdmin: Boolean!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  isAdmin: Boolean
  email: String
  password: String
  tasks: TaskUpdateManyWithoutAuthorInput
  notifications: TaskNotificationUpdateManyWithoutUserInput
  preference: PreferenceUpdateOneWithoutForUserInput
}

input UserUpdateManyMutationInput {
  isAdmin: Boolean
  email: String
  password: String
}

input UserUpdateOneRequiredWithoutPreferenceInput {
  create: UserCreateWithoutPreferenceInput
  update: UserUpdateWithoutPreferenceDataInput
  upsert: UserUpsertWithoutPreferenceInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneWithoutNotificationsInput {
  create: UserCreateWithoutNotificationsInput
  update: UserUpdateWithoutNotificationsDataInput
  upsert: UserUpsertWithoutNotificationsInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateOneWithoutTasksInput {
  create: UserCreateWithoutTasksInput
  update: UserUpdateWithoutTasksDataInput
  upsert: UserUpsertWithoutTasksInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutNotificationsDataInput {
  isAdmin: Boolean
  email: String
  password: String
  tasks: TaskUpdateManyWithoutAuthorInput
  preference: PreferenceUpdateOneWithoutForUserInput
}

input UserUpdateWithoutPreferenceDataInput {
  isAdmin: Boolean
  email: String
  password: String
  tasks: TaskUpdateManyWithoutAuthorInput
  notifications: TaskNotificationUpdateManyWithoutUserInput
}

input UserUpdateWithoutTasksDataInput {
  isAdmin: Boolean
  email: String
  password: String
  notifications: TaskNotificationUpdateManyWithoutUserInput
  preference: PreferenceUpdateOneWithoutForUserInput
}

input UserUpsertWithoutNotificationsInput {
  update: UserUpdateWithoutNotificationsDataInput!
  create: UserCreateWithoutNotificationsInput!
}

input UserUpsertWithoutPreferenceInput {
  update: UserUpdateWithoutPreferenceDataInput!
  create: UserCreateWithoutPreferenceInput!
}

input UserUpsertWithoutTasksInput {
  update: UserUpdateWithoutTasksDataInput!
  create: UserCreateWithoutTasksInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  isAdmin: Boolean
  isAdmin_not: Boolean
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  tasks_every: TaskWhereInput
  tasks_some: TaskWhereInput
  tasks_none: TaskWhereInput
  notifications_every: TaskNotificationWhereInput
  notifications_some: TaskNotificationWhereInput
  notifications_none: TaskNotificationWhereInput
  preference: PreferenceWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    