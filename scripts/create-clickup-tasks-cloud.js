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
  console.error("Please add these secrets to your GitHub repository:");
  console.error("- CLICKUP_API_TOKEN: Your ClickUp API token");
  console.error("- CLICKUP_LIST_ID: Your ClickUp list ID");
  process.exit(1);
}

// Test ClickUp token validity first
async function testClickUpToken() {
  try {
    const res = await axios.get("https://api.clickup.com/api/v2/user", {
      headers: {
        Authorization: CLICKUP_API_TOKEN,
      },
    });
    console.log("✅ ClickUp token is valid - authenticated as:", res.data.user?.username || "User");
    return true;
  } catch (err) {
    console.error("❌ ClickUp token is invalid:", err.response?.data || err.message);
    console.error("Please check your CLICKUP_API_TOKEN secret");
    return false;
  }
}

// Create ClickUp task
async function createClickUpTask(taskPayload) {
  try {
    console.log("Creating ClickUp task:", taskPayload.name);
    
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

    console.log(`✅ Task created: ${res.data.name}`);
    console.log(`🔗 Task URL: ${res.data.url || "https://app.clickup.com/t/" + res.data.id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create ClickUp task:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      
      if (err.response.status === 401) {
        console.error("🔑 Token error: Your ClickUp API token is invalid or expired");
        console.error("Please generate a new token at: https://app.clickup.com/settings/apps");
      } else if (err.response.status === 404) {
        console.error("📋 List error: The list ID might be incorrect");
      }
    } else {
      console.error(err.message);
    }
    throw err;
  }
}

// Main
(async () => {
  try {
    // First, test the ClickUp token
    const tokenValid = await testClickUpToken();
    if (!tokenValid) {
      process.exit(1);
    }

    // Get test results from Cypress summary or create fallback
    const failedTests = [];
    
    // Try to get failed tests from Cypress Cloud if available
    if (CYPRESS_RECORD_KEY && CYPRESS_PROJECT_ID && CYPRESS_RUN_ID && CYPRESS_RUN_ID !== "undefined") {
      try {
        console.log("Fetching Cypress Cloud run data...");
        console.log(`Run ID: ${CYPRESS_RUN_ID}`);
        console.log(`Project ID: ${CYPRESS_PROJECT_ID}`);
        
        const url = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
          },
        });
        
        const runData = res.data;
        
        // Extract failed tests
        if (runData.tests) {
          runData.tests.forEach(test => {
            if (test.state === "failed") {
              failedTests.push({
                title: test.title,
                suite: test.suite?.join(" > ") || "Unknown Suite",
                error: test.error,
              });
            }
          });
        }
        
        console.log(`Found ${failedTests.length} failed tests in Cypress Cloud`);
      } catch (err) {
        console.warn("⚠️ Failed to fetch Cypress Cloud run:", err.message);
      }
    }

    // If no failed tests found via API, create a single task with the summary
    if (failedTests.length === 0) {
      console.log("No failed tests detected via API, creating summary task...");
      
      const summaryTask = {
        name: `❌ Test Failures - ${GITHUB_REF_NAME || "unknown"} branch`,
        description: `
## Test Failure Summary

**Branch:** ${GITHUB_REF_NAME || "unknown"}
**Commit:** ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : "unknown"}
**Run ID:** ${GITHUB_RUN_ID || "unknown"}

### Links
- 🔗 [GitHub Actions Run](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID || "unknown"})
- 🔗 [Cypress Cloud Run](https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID || "unknown"})

### Test Results
The Cypress tests failed. Please check the GitHub Actions logs for details.

---

*This task was automatically created by the CI pipeline.*
        `.trim(),
        status: "to do",
        priority: 3, // 1 = urgent, 2 = high, 3 = normal, 4 = low
        tags: ["cypress", "test-failure", "ci"],
      };

      await createClickUpTask(summaryTask);
      console.log("✅ Summary task created");
    } else {
      // Create individual tasks for each failed test
      console.log(`Creating ${failedTests.length} task(s) for failed tests...`);

      for (const test of failedTests) {
        const taskPayload = {
          name: `❌ ${test.title}`,
          description: `
## Test Failure Details

**Suite:** ${test.suite}
**Test:** ${test.title}

### Error
\`\`\`
${test.error || "No error details available"}
\`\`\`

### Links
- 🔗 [Cypress Cloud Run](https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID})
- 🔗 [GitHub Actions](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID})

---

*This task was automatically created by the CI pipeline.*
          `.trim(),
          status: "to do",
          priority: 3,
          tags: ["cypress", "test-failure", "ci"],
        };

        await createClickUpTask(taskPayload);
      }

      console.log(`✅ Created ${failedTests.length} task(s)`);
    }
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
})();