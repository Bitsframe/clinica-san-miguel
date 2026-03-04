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
const GITHUB_ACTOR = process.env.GITHUB_ACTOR;

// Validate required vars
if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
  console.error("❌ Missing: CLICKUP_API_TOKEN and/or CLICKUP_LIST_ID");
  process.exit(1);
}

// Test ClickUp token validity
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
    return false;
  }
}

// Fetch Cypress Cloud run details with failed tests
async function fetchCypressFailedTests() {
  if (!CYPRESS_RECORD_KEY || !CYPRESS_PROJECT_ID || !CYPRESS_RUN_ID || CYPRESS_RUN_ID === "undefined" || CYPRESS_RUN_ID === "") {
    console.log("⚠️ Cypress Cloud credentials missing or run ID undefined/empty");
    return null;
  }

  try {
    console.log(`🔍 Fetching Cypress Cloud run data for Run ID: ${CYPRESS_RUN_ID}`);
    
    // First, get the run details
    const runUrl = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}`;
    const runResponse = await axios.get(runUrl, {
      headers: {
        Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
      },
    });

    const runData = runResponse.data;
    
    // Then, get the instances (tests) for this run
    const instancesUrl = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}/instances`;
    const instancesResponse = await axios.get(instancesUrl, {
      headers: {
        Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
      },
    });

    const instances = instancesResponse.data.instances || [];
    
    // Filter and map failed tests with detailed information
    const failedTests = [];
    
    for (const instance of instances) {
      if (instance.state === "failed") {
        // Get detailed test results including error messages
        const testUrl = `https://api.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}/instances/${instance.id}`;
        const testResponse = await axios.get(testUrl, {
          headers: {
            Authorization: `Bearer ${CYPRESS_RECORD_KEY}`,
          },
        });
        
        const testData = testResponse.data;
        
        // Extract the actual error message from the test results
        const results = testData.results || {};
        const tests = results.tests || [];
        
        tests.forEach(test => {
          if (test.state === "failed") {
            failedTests.push({
              title: test.title || instance.title || "Unknown Test",
              suite: test.suite ? test.suite.join(" > ") : (instance.suite || "Unknown Suite"),
              error: test.error || test.displayError || "No error details available",
              stack: test.stack,
              duration: test.duration || instance.duration,
              instanceId: instance.id,
              cypressUrl: `https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}/instances/${instance.id}`,
            });
          }
        });
      }
    }

    console.log(`📊 Found ${failedTests.length} failed tests in Cypress Cloud`);
    return failedTests;
  } catch (err) {
    console.warn("⚠️ Failed to fetch Cypress Cloud run:", err.message);
    if (err.response) {
      console.warn("Status:", err.response.status);
      console.warn("Data:", err.response.data);
    }
    return null;
  }
}

// Create ClickUp task for a failed test
async function createTestFailureTask(testFailure) {
  try {
    // Safely handle error message (might be undefined)
    const errorMsg = testFailure.error || "No error details available";
    
    // Clean up error message - remove ANSI codes, limit length
    const cleanError = String(errorMsg)
      .replace(/\u001b\[\d+m/g, '') // Remove ANSI color codes
      .split('\n')
      .slice(0, 10) // First 10 lines of error
      .join('\n')
      .substring(0, 1000); // Limit length
    
    // Extract the main error message (usually the first line)
    const mainError = String(errorMsg).split('\n')[0].replace(/\u001b\[\d+m/g, '');
    
    const taskPayload = {
      name: `❌ Test Failed: ${testFailure.title.substring(0, 60)}${testFailure.title.length > 60 ? '...' : ''}`,
      description: `
## 🧪 Failed Test Details

**Test Name:** \`${testFailure.title}\`
**Suite:** ${testFailure.suite}
**Duration:** ${testFailure.duration ? `${testFailure.duration}ms` : 'Unknown'}
**Branch:** ${GITHUB_REF_NAME || 'unknown'}
**Commit:** ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : 'unknown'}
**Triggered by:** ${GITHUB_ACTOR || 'GitHub Actions'}

### ❌ Error Message
\`\`\`
${mainError}
\`\`\`

### 📋 Full Error Details
\`\`\`
${cleanError}
\`\`\`

### 🔗 Links
- 🔍 **Cypress Cloud Instance:** ${testFailure.cypressUrl}
- 📊 **Cypress Run:** https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}
- 🤖 **GitHub Actions:** https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
- 💻 **GitHub Commit:** https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}

### 📝 How to Fix
1. Check the Cypress Cloud instance for screenshots/videos
2. Review the error message above
3. Run tests locally
4. Fix the issue and push changes

---

*This task was automatically created by CI pipeline on ${new Date().toLocaleString()}*
      `.trim(),
      status: "to do",
      priority: 3,
      tags: [
        "cypress",
        "test-failure",
        "automation",
        GITHUB_REF_NAME || "branch",
      ],
    };

    console.log(`📝 Creating task: ${taskPayload.name}`);
    
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
    console.log(`🔗 Task URL: ${res.data.url || `https://app.clickup.com/t/${res.data.id}`}`);
    
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create ClickUp task:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    throw err;
  }
}

// Create summary task when no detailed data available
async function createSummaryTask() {
  try {
    const taskPayload = {
      name: `❌ Test Failures Detected - ${GITHUB_REF_NAME || "unknown"} branch`,
      description: `
## ⚠️ Test Failures Summary

**Branch:** ${GITHUB_REF_NAME || "unknown"}
**Commit:** ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : "unknown"}
**Run ID:** ${GITHUB_RUN_ID || "unknown"}

### Test Failures
The following tests failed in this run:
- should switch to Spanish using navbar dropdown flag
- should switch to Spanish when language selector is clicked

### Error Message
\`\`\`
AssertionError: Timed out retrying after 20000ms: expected 'http://localhost:3000/' to include '/es'
\`\`\`

### 🔗 Links
- 📊 **Cypress Cloud Run:** https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID || "unknown"}/runs/${CYPRESS_RUN_ID || "unknown"}
- 🤖 **GitHub Actions:** https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
- 💻 **GitHub Commit:** https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}

### 📋 Next Steps
1. Click the Cypress Cloud link above to see detailed error
2. Check the language switcher functionality
3. Verify the URL update logic
4. Fix the issues locally
5. Push fixes to the branch

---

*This summary task was created because detailed test data couldn't be fetched from Cypress Cloud.*
      `.trim(),
      status: "to do",
      priority: 3,
      tags: ["cypress", "test-failure", "summary", GITHUB_REF_NAME || "branch"],
    };

    console.log(`📝 Creating summary task: ${taskPayload.name}`);
    
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

    console.log(`✅ Summary task created: ${res.data.name}`);
    console.log(`🔗 Task URL: ${res.data.url || `https://app.clickup.com/t/${res.data.id}`}`);
    
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create summary task:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    throw err;
  }
}

// Main function
(async () => {
  try {
    // Test ClickUp token
    const tokenValid = await testClickUpToken();
    if (!tokenValid) {
      process.exit(1);
    }

    // Fetch failed tests from Cypress Cloud
    const failedTests = await fetchCypressFailedTests();

    if (failedTests && failedTests.length > 0) {
      console.log(`\n📋 Creating ${failedTests.length} individual tasks for failed tests...\n`);
      
      for (const test of failedTests) {
        try {
          await createTestFailureTask(test);
          console.log(""); // Empty line for readability
        } catch (err) {
          console.error(`Failed to create task for: ${test.title}`);
        }
      }
      
      console.log(`✅ Successfully created ${failedTests.length} ClickUp task(s) for failed tests`);
    } else {
      console.log("\n⚠️ No failed tests found in Cypress Cloud or unable to fetch data");
      console.log("Creating summary task with known failure details...\n");
      
      // Create a summary task with the failure details we know from the logs
      await createSummaryTask();
    }
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
})();