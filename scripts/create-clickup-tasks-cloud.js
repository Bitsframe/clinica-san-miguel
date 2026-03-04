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

// Hardcoded failed tests from your log
const FAILED_TESTS = [
  {
    title: "should switch to Spanish using navbar dropdown flag",
    suite: "Spanish Language Test",
    error: "AssertionError: Timed out retrying after 20000ms: expected 'http://localhost:3000/' to include '/es'",
    lineNumber: 47
  },
  {
    title: "should switch to Spanish when language selector is clicked",
    suite: "Spanish Language Test",
    error: "AssertionError: Timed out retrying after 20000ms: expected 'http://localhost:3000/' to include '/es'",
    lineNumber: 69
  }
];

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

// Create ClickUp task for a failed test
async function createTestFailureTask(test, index) {
  try {
    const taskName = `❌ Test Failed #${index + 1}: ${test.title}`;
    
    const taskPayload = {
      name: taskName,
      description: `
## 🧪 Failed Test Details

**Test Name:** \`${test.title}\`
**Suite:** ${test.suite}
**Line Number:** ${test.lineNumber}
**Branch:** ${GITHUB_REF_NAME || 'mavra-testing'}
**Commit:** ${GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : '4bdcb5b'}
**Triggered by:** ${GITHUB_ACTOR || 'CI Pipeline'}

### ❌ Error Message
\`\`\`
${test.error}
\`\`\`

### 📋 Test Summary
- **Total Tests:** 10
- **Passing:** 8
- **Failing:** 2
- **Duration:** 3 minutes 44 seconds

### 🔗 Links
- 📊 **Cypress Cloud Run:** https://cloud.cypress.io/projects/${CYPRESS_PROJECT_ID || 'cfoa1c'}/runs/${CYPRESS_RUN_ID || '29'}
- 🤖 **GitHub Actions:** https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
- 💻 **GitHub Commit:** https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}

### 📝 How to Fix
1. **Check the language switcher functionality** in the navbar
2. **Verify the URL update logic** - when clicking Spanish flag, URL should change to /es
3. **Common issues:**
   - Click handler not working
   - Navigation not triggered
   - i18n routing not configured correctly
   - Event propagation issues
4. **Run locally to debug:**
   \`\`\`bash
   yarn dev
   npx cypress open --spec cypress/e2e/spanish-language.cy.ts
   \`\`\`

---

*This task was automatically created by CI pipeline on ${new Date().toLocaleString()}*
      `.trim(),
      status: "to do",
      priority: 3,
      tags: [
        "cypress",
        "test-failure",
        "language-test",
        "spanish",
        GITHUB_REF_NAME || "mavra-testing"
      ],
    };

    console.log(`📝 Creating task ${index + 1}/2: ${taskName}`);
    
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
    console.log(""); // Empty line for readability
    
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

    console.log(`\n📋 Creating ${FAILED_TESTS.length} individual tasks for failed tests...\n`);

    // Create a task for EACH failed test
    for (let i = 0; i < FAILED_TESTS.length; i++) {
      await createTestFailureTask(FAILED_TESTS[i], i);
    }

    console.log("===========================================");
    console.log(`✅ SUCCESS: Created ${FAILED_TESTS.length} ClickUp tasks for failed tests`);
    console.log("===========================================");
    
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    
  }
})();