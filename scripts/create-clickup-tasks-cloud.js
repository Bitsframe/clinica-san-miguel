const axios = require("axios");

// Environment variables
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;
const CYPRESS_RECORD_KEY = process.env.CYPRESS_RECORD_KEY;
const CYPRESS_PROJECT_ID = process.env.CYPRESS_PROJECT_ID;
const CYPRESS_RUN_ID = process.env.CYPRESS_RUN_ID;
const GITHUB_SHA = process.env.GITHUB_SHA;
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID;

// Validate required vars
if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
  console.error("❌ Missing: CLICKUP_API_TOKEN and/or CLICKUP_LIST_ID");
  process.exit(1);
}

// Create ClickUp task
async function createClickUpTask(taskPayload) {
  try {
    const res = await axios.post(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      taskPayload,
      {
        headers: {
          Authorization: CLICKUP_API_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`✅ Task created: ${res.data.task?.name || res.data.name}`);
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to create ClickUp task:",
      err.response?.data || err.message,
    );
    throw err;
  }
}

// Fetch Cypress Cloud run data
async function fetchCypressRun() {
  if (!CYPRESS_RECORD_KEY || !CYPRESS_PROJECT_ID || !CYPRESS_RUN_ID) {
    return null;
  }

  try {
    const url = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
      },
    });
    return res.data;
  } catch (err) {
    console.warn("⚠️ Failed to fetch Cypress Cloud run:", err.message);
    return null;
  }
}

// Extract test details from Cypress run data
function getTestDetails(runData) {
  const tests = [];

  (runData.suites || []).forEach((suite) => {
    const suiteName = suite.title;
    (suite.tests || []).forEach((test) => {
      tests.push({
        suite: suiteName,
        title: test.title,
        state: test.state,
        duration: test.duration,
      });
    });
  });

  return tests;
}

// Main
(async () => {
  try {
    // If Cypress Cloud token/project missing, create fallback task
    if (
      !CYPRESS_RECORD_KEY ||
      !CYPRESS_PROJECT_ID ||
      !CYPRESS_RUN_ID ||
      CYPRESS_RUN_ID === "unknown"
    ) {
      console.warn(
        "⚠️ Cypress Cloud data unavailable. Creating fallback task...",
      );

      const fallbackTask = {
        name: `❌ Test Failure - ${GITHUB_REF_NAME || "unknown"} branch`,
        description: `
Test Failure Detected
---------------------
Branch: ${GITHUB_REF_NAME || "unknown"}
Commit: ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : "unknown"}

GitHub Actions Run:
https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID || "unknown"}

Please check the GitHub Actions logs for test details.
        `.trim(),
        status: "to do",
        priority: 2,
        tags: ["cypress", "test-failure"],
      };

      await createClickUpTask(fallbackTask);
      console.log("✅ Fallback task created");
      return;
    }

    // Fetch actual test data from Cypress Cloud
    console.log("Fetching Cypress Cloud run data...");
    const runData = await fetchCypressRun();

    if (!runData) {
      console.warn(
        "⚠️ Could not fetch Cypress Cloud data. Creating fallback...",
      );

      const fallbackTask = {
        name: `⚠️ Cypress Run ${CYPRESS_RUN_ID} - Failed to fetch details`,
        description: `
Run ID: ${CYPRESS_RUN_ID}
Branch: ${GITHUB_REF_NAME || "unknown"}

Cypress Cloud: https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}
GitHub Actions: https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
        `.trim(),
        status: "to do",
        priority: 2,
        tags: ["cypress", "test-failure"],
      };

      await createClickUpTask(fallbackTask);
      return;
    }

    const tests = getTestDetails(runData);
    const failedTests = tests.filter((t) => t.state === "failed");

    if (failedTests.length === 0) {
      console.log("✅ No failed tests detected");
      return;
    }

    console.log(`Creating ${failedTests.length} task(s) for failed tests...`);

    for (const test of failedTests) {
      const taskPayload = {
        name: `❌ ${test.title}`,
        description: `
Test Failure Details
--------------------
Suite: ${test.suite}
Test: ${test.title}
Duration: ${test.duration}ms

Cypress Run: https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}
GitHub Actions: https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
        `.trim(),
        status: "to do",
        priority: 2,
        tags: ["cypress", "test-failure"],
      };

      await createClickUpTask(taskPayload);
    }

    console.log(`✅ Created ${failedTests.length} task(s)`);
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
})();
