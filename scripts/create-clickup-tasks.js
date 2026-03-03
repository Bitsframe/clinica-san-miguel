const axios = require("axios");

/**
 * Creates simple ClickUp task when Cypress tests fail
 * No JSON parsing - just report the failure
 */

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;
const GITHUB_SHA = process.env.GITHUB_SHA || "unknown";
const GITHUB_BRANCH = process.env.GITHUB_REF_NAME || "unknown";
const GITHUB_RUN_URL = process.env.GITHUB_SERVER_URL
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : "N/A";

async function createClickUpTask() {
  const taskData = {
    name: `🐛 Test Failure - ${GITHUB_BRANCH} - Spanish Language Tests`,
    description:
      `**Test Suite**: Spanish Language Tests\n\n` +
      `**Branch**: \`${GITHUB_BRANCH}\`\n` +
      `**Commit**: \`${GITHUB_SHA.substring(0, 7)}\`\n\n` +
      `**GitHub Actions Run**:\n${GITHUB_RUN_URL}\n\n` +
      `**Cypress Cloud**:\nhttps://cloud.cypress.io/projects/cfoa1c\n\n` +
      `Action required: Review failed tests in the links above.`,
    status: "to do",
    priority: 2,
    tags: ["cypress", "bug", "test-failure"],
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

    console.log(
      `✅ ClickUp task created: ${response.data.task.name} (${response.data.task.id})`,
    );
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

  console.log("Creating ClickUp task for test failure...");
  await createClickUpTask();
  console.log("✅ Done");
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
