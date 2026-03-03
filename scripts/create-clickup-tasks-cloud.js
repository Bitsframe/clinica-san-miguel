const axios = require("axios");

// Required environment variables
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;
const CYPRESS_RECORD_KEY = process.env.CYPRESS_RECORD_KEY;
const CYPRESS_PROJECT_ID = process.env.CYPRESS_PROJECT_ID;
const CYPRESS_RUN_ID = process.env.CYPRESS_RUN_ID;
const GITHUB_SHA = process.env.GITHUB_SHA;
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID;

if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID || !CYPRESS_PROJECT_ID || !CYPRESS_RUN_ID) {
  console.error(
    "❌ Missing env variables. Make sure CLICKUP_API_TOKEN, CLICKUP_LIST_ID, CYPRESS_PROJECT_ID, and CYPRESS_RUN_ID are set."
  );
  process.exit(1);
}

// Fetch Cypress Cloud run data
async function fetchCypressRun() {
  try {
    const url = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch Cypress Cloud run:", err.response?.data || err.message);
    return null;
  }
}

// Extract test details (all tests)
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

  return tests.length ? tests : [{ title: "Unknown Test", state: "unknown", suite: "", duration: 0 }];
}

// Create ClickUp task for each test
async function createClickUpTask(test) {
  const taskPayload = {
    name: `${test.state === "failed" ? "❌" : "✅"} ${test.title}`,
    description: `
Cypress Test Details
-------------------
Suite: ${test.suite}
Test: ${test.title}
State: ${test.state}
Duration: ${test.duration}ms

Cypress Run: https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}

GitHub Workflow:
Repository: ${GITHUB_REPOSITORY}
Branch: ${GITHUB_REF_NAME}
Commit: ${GITHUB_SHA}
Run ID: ${GITHUB_RUN_ID}
    `.trim(),
  };

  try {
    const res = await axios.post(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      taskPayload,
      {
        headers: {
          Authorization: CLICKUP_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Task created: ${res.data.name}`);
  } catch (err) {
    console.error("❌ Failed to create ClickUp task:", err.response?.data || err.message);
  }
}

// Main
(async () => {
  const runData = await fetchCypressRun();
  if (!runData) {
    console.error("🔴 No run data available. Exiting...");
    process.exit(1);
  }

  const tests = getTestDetails(runData);

  for (const test of tests) {
    if (test.state === "failed") {
      await createClickUpTask(test);
    }
  }

  console.log(`✅ Total ${tests.filter(t => t.state === "failed").length} ClickUp task(s) created for failed tests.`);
})();