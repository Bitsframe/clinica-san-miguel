const axios = require("axios");

/**
 * Creates ClickUp tasks for failed Cypress tests
 * Usage: node scripts/create-clickup-tasks.js
 */

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;
const GITHUB_SHA = process.env.GITHUB_SHA || "unknown";
const GITHUB_BRANCH = process.env.GITHUB_REF_NAME || "unknown";
const GITHUB_RUN_URL = process.env.GITHUB_SERVER_URL
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : "N/A";

const failedTests = [
  {
    suite: "Form Submission Test",
    test: "should validate email format",
    error: "Timeout waiting for element",
  },
  // Add more as detected
];

async function createClickUpTask(testFailure) {
  const taskData = {
    name: `🐛 Fix: ${testFailure.suite} - ${testFailure.test}`,
    description:
      `**Cypress Test Failure**\n\n` +
      `**Suite**: ${testFailure.suite}\n` +
      `**Test**: ${testFailure.test}\n` +
      `**Error**: ${testFailure.error}\n\n` +
      `**Branch**: \`${GITHUB_BRANCH}\`\n` +
      `**Commit**: \`${GITHUB_SHA.substring(0, 7)}\`\n` +
      `**GitHub Actions**: ${GITHUB_RUN_URL}\n` +
      `**Cypress Cloud**: https://cloud.cypress.io/projects/cfoa1c\n\n` +
      `**Steps to Reproduce**:\n` +
      `1. Checkout branch \`${GITHUB_BRANCH}\`\n` +
      `2. Run: \`npx cypress run --spec "cypress/e2e/*.cy.ts"\`\n` +
      `3. Review failing test\n\n` +
      `**Action Required**: Debug and fix the failing test.`,
    status: "to do",
    priority: 2,
    tags: ["cypress", "bug", "test-failure", "automated"],
    custom_fields: [],
  };

  try {
    const response = await axios.post(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      taskData,
      {
        headers: {
          Authorization: CLICKUP_API_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`✅ ClickUp task created: ${response.data.url}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to create ClickUp task:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
    console.error("❌ Missing required environment variables:");
    console.error("   - CLICKUP_API_TOKEN");
    console.error("   - CLICKUP_LIST_ID");
    process.exit(1);
  }

  console.log("Creating ClickUp tasks for failed tests...");

  for (const failure of failedTests) {
    await createClickUpTask(failure);
  }

  console.log(`\n✅ Created ${failedTests.length} ClickUp task(s)`);
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
