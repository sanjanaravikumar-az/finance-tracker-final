import { defineData } from '@aws-amplify/backend';

const schema = `
type Transaction @model @auth(rules: [{ allow: public, operations: [read] }, { allow: owner, operations: [create, read, update, delete] }]) {
  id: ID!
  description: String!
  amount: Float!
  type: TransactionType!
  category: String!
  date: AWSDateTime!
  receiptUrl: String
  owner: String
}

enum TransactionType {
  INCOME
  EXPENSE
}

type Budget @model @auth(rules: [{ allow: public, operations: [read] }, { allow: owner, operations: [create, read, update, delete] }]) {
  id: ID!
  category: String!
  limit: Float!
  month: String!
  owner: String
}

type FinancialSummary @model @auth(rules: [{ allow: public, operations: [read] }, { allow: owner, operations: [create, read, update, delete] }]) {
  id: ID!
  totalIncome: Float!
  totalExpenses: Float!
  balance: Float!
  month: String!
  owner: String
}

type CalculatedSummary {
  totalIncome: Float! @auth(rules: [{ allow: public }])
  totalExpenses: Float! @auth(rules: [{ allow: public }])
  balance: Float! @auth(rules: [{ allow: public }])
  savingsRate: Float! @auth(rules: [{ allow: public }])
}

type NotificationResult {
  success: Boolean! @auth(rules: [{ allow: public }])
  message: String! @auth(rules: [{ allow: public }])
}

type TransactionConnection {
  items: [Transaction] @auth(rules: [{ allow: public }])
  nextToken: String @auth(rules: [{ allow: public }])
}

type Query {
  calculateFinancialSummary: CalculatedSummary @function(name: "financetrackerfinal82393814-${branchName}") @auth(rules: [{ allow: public }])
  getTransactionsByCategory(category: String!, limit: Int): TransactionConnection @auth(rules: [{ allow: public }])
}

type Mutation {
  sendMonthlyReport(email: String!): NotificationResult @function(name: "financetrackerfinal82393814-${branchName}") @auth(rules: [{ allow: public }])
  sendBudgetAlert(email: String!, category: String!, exceeded: Float!): NotificationResult @function(name: "financetrackerfinal82393814-${branchName}") @auth(rules: [{ allow: public }])
}
`;

export const data = defineData({
  migratedAmplifyGen1DynamoDbTableMappings: [
    {
      //The "branchname" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
      branchName: 'main',
      modelNameToTableNameMapping: {
        Transaction: 'Transaction-b76n3e3ffbgc3c6wt523ogdwve-main',
        Budget: 'Budget-b76n3e3ffbgc3c6wt523ogdwve-main',
        FinancialSummary: 'FinancialSummary-b76n3e3ffbgc3c6wt523ogdwve-main',
      },
    },
  ],
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 200,
      description: 'graphqlapikey',
    },
  },
  schema,
});
