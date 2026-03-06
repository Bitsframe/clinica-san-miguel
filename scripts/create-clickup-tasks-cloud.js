const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
const TEST_RESULTS = process.env.TEST_RESULTS;

/**
 * Parse failed tests from Cypress JSON report or environment variable
 * NO HARDCODED TESTS - dynamically reads from actual test results
 */
function getFailedTests() {
  const failedTests = [];

  // Option 1: Parse from TEST_RESULTS environment variable (passed from GitHub Actions)
  if (TEST_RESULTS) {
    try {
      const results = JSON.parse(TEST_RESULTS);
      if (results && results.runs) {
        results.runs.forEach((run) => {
          if (run.tests) {
            run.tests.forEach((test) => {
              if (test.state === "failed") {
                failedTests.push({
                  title:
                    test.title?.join(" > ") || test.title || "Unknown test",
                  suite: run.spec?.name || "Unknown suite",
                  error:
                    test.displayError ||
                    test.error?.message ||
                    "No error message",
                  duration: test.duration || 0,
                  specFile: run.spec?.relative || run.spec?.name || "Unknown",
                });
              }
            });
          }
        });
      }
      console.log(
        `📊 Parsed ${failedTests.length} failed tests from TEST_RESULTS env`,
      );
      return failedTests;
    } catch (e) {
      console.warn("⚠️ Could not parse TEST_RESULTS:", e.message);
    }
  }

  // Option 2: Read from Cypress JSON report files
  const reportPaths = [
    "cypress/results/results.json",
    "cypress/results/output.json",
    "mochawesome-report/mochawesome.json",
    "cypress/reports/mochawesome.json",
  ];

  for (const reportPath of reportPaths) {
    const fullPath = path.resolve(process.cwd(), reportPath);
    if (fs.existsSync(fullPath)) {
      try {
        const report = JSON.parse(fs.readFileSync(fullPath, "utf8"));

        // Handle mochawesome format
        if (report.results) {
          report.results.forEach((result) => {
            if (result.suites) {
              result.suites.forEach((suite) => {
                if (suite.tests) {
                  suite.tests.forEach((test) => {
                    if (test.fail || test.state === "failed") {
                      failedTests.push({
                        title: test.title || test.fullTitle || "Unknown test",
                        suite: suite.title || result.file || "Unknown suite",
                        error:
                          test.err?.message ||
                          test.err?.estack ||
                          "No error message",
                        duration: test.duration || 0,
                        specFile: result.file || "Unknown",
                      });
                    }
                  });
                }
              });
            }
          });
        }

        // Handle Cypress JSON format
        if (report.runs) {
          report.runs.forEach((run) => {
            if (run.tests) {
              run.tests.forEach((test) => {
                if (test.state === "failed") {
                  failedTests.push({
                    title: Array.isArray(test.title)
                      ? test.title.join(" > ")
                      : test.title,
                    suite: run.spec?.name || "Unknown suite",
                    error:
                      test.displayError ||
                      test.error?.message ||
                      "No error message",
                    duration: test.duration || 0,
                    specFile: run.spec?.relative || "Unknown",
                  });
                }
              });
            }
          });
        }

        if (failedTests.length > 0) {
          console.log(
            `📊 Found ${failedTests.length} failed tests from ${reportPath}`,
          );
          return failedTests;
        }
      } catch (e) {
        console.warn(`⚠️ Could not parse ${reportPath}:`, e.message);
      }
    }
  }

  // Option 3: Check for Cypress Cloud API (if we have run ID)
  if (CYPRESS_PROJECT_ID && CYPRESS_RUN_ID && CYPRESS_RECORD_KEY) {
    console.log("ℹ️ No local report found. Check Cypress Cloud for results.");
    console.log(
      `   https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}`,
    );
  }

  console.log("⚠️ No failed tests found in any report source");
  return failedTests;
}

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
    console.log(
      "✅ ClickUp token is valid - authenticated as:",
      res.data.user?.username || "User",
    );
    return true;
  } catch (err) {
    console.error(
      "❌ ClickUp token is invalid:",
      err.response?.data || err.message,
    );
    return false;
  }
}

// Create ClickUp task for a failed test - DYNAMIC, NO HARDCODED VALUES
async function createTestFailureTask(test, index, totalFailed) {
  try {
    const taskName = `❌ Test Failed: ${test.title.substring(0, 100)}`;

    // Extract spec file name for tags
    const specFileName = test.specFile
      ? path.basename(test.specFile, ".cy.ts")
      : "unknown-spec";

    const taskPayload = {
      name: taskName,
      description: `
## 🧪 Failed Test Details

**Test Name:** \`${test.title}\`
**Suite:** ${test.suite}
**Spec File:** ${test.specFile || "Unknown"}
**Duration:** ${test.duration ? `${(test.duration / 1000).toFixed(2)}s` : "N/A"}
**Branch:** ${GITHUB_REF_NAME || "unknown"}
**Commit:** ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : "unknown"}
**Triggered by:** ${GITHUB_ACTOR || "CI Pipeline"}

### ❌ Error Message
\`\`\`
${test.error}
\`\`\`

### 🔗 Links
${CYPRESS_PROJECT_ID && CYPRESS_RUN_ID ? `- 📊 **Cypress Cloud Run:** https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID}/runs/${CYPRESS_RUN_ID}` : ""}
${GITHUB_REPOSITORY && GITHUB_RUN_ID ? `- 🤖 **GitHub Actions:** https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : ""}
${GITHUB_REPOSITORY && GITHUB_SHA ? `- 💻 **GitHub Commit:** https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}` : ""}

### 📝 How to Reproduce
\`\`\`bash
yarn dev
npx cypress open --spec ${test.specFile || "cypress/e2e/"}
\`\`\`

---

*Auto-created by CI on ${new Date().toISOString()}*
      `.trim(),
      status: "to do",
      priority: 2,
      tags: [
        "cypress",
        "test-failure",
        "automated",
        specFileName,
        GITHUB_REF_NAME || "main",
      ].filter(Boolean),
    };

    console.log(
      `📝 Creating task ${index + 1}/${totalFailed}: ${test.title.substring(0, 50)}...`,
    );

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

    console.log(`✅ Task created: ${res.data.id}`);
    console.log(
      `🔗 Task URL: ${res.data.url || `https://app.clickup.com/t/${res.data.id}`}`,
    );
    console.log("");

    return res.data;
  } catch (err) {
    console.error(`❌ Failed to create task for: ${test.title}`);
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
    console.log("🚀 Starting ClickUp task creation for failed tests...");
    console.log("===========================================");

    // Test ClickUp token
    const tokenValid = await testClickUpToken();
    if (!tokenValid) {
      process.exit(1);
    }

    // Get failed tests dynamically - NO HARDCODED TESTS
    const failedTests = getFailedTests();

    if (failedTests.length === 0) {
      console.log("✅ No failed tests found - nothing to create!");
      console.log("===========================================");
      process.exit(0);
    }

    console.log(
      `\n📋 Creating ${failedTests.length} task(s) for failed tests...\n`,
    );

    // Create a task for EACH failed test
    for (let i = 0; i < failedTests.length; i++) {
      await createTestFailureTask(failedTests[i], i, failedTests.length);
    }

    console.log("===========================================");
    console.log(`✅ SUCCESS: Created ${failedTests.length} ClickUp task(s)`);
    console.log("===========================================");
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
})();
