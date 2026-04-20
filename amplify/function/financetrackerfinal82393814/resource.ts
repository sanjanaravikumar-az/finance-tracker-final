import { defineFunction } from '@aws-amplify/backend';

const branchName = process.env.AWS_BRANCH ?? 'sandbox';

export const financetrackerfinal82393814 = defineFunction({
  entry: './index.js',
  name: `financetrackerfinal82393814-${branchName}`,
  timeoutSeconds: 25,
  memoryMB: 128,
  environment: {
    BUDGET_ALERT_TOPIC_ARN:
      'arn:aws:sns:us-east-1:079385506759:amplify-financetrackerfinal-main-40c0c-customfinancereport-1FJNVMWM80Q3G-BudgetAlertTopicF20DF526-ihtfFQB8gXFA',
    MONTHLY_REPORT_TOPIC_ARN:
      'arn:aws:sns:us-east-1:079385506759:amplify-financetrackerfinal-main-40c0c-customfinancereport-1FJNVMWM80Q3G-MonthlyReportTopic8D223100-ML4RytYLU7Md',
    ENV: `${branchName}`,
    REGION: 'us-east-1',
  },
  runtime: 22,
});
