const axios = require("axios");
const fs = require("fs");

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

async function getFailedTests() {
  try {
    const report = JSON.parse(fs.readFileSync("cypress-report.json", "utf8"));
    const failedTests = [];

    for (const run of report.runs || []) {
      for (const test of run.tests || []) {
        if (test.state === "failed") {
          failedTests.push(test.title.join(" > "));
        }
      }
    }

    return failedTests.length ? failedTests : ["Unknown Test Failure"];
  } catch (err) {
    return ["Test Failure (Could not parse report)"];
  }
}

async function createClickUpTask(testName) {
  const taskData = {
    name: `❌ ${testName}`,
    description: `Cypress test failed:\n\n${testName}`,
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
      }
    );

    console.log(`✅ Task created: ${response.data.name}`);
  } catch (error) {
    console.error("❌ Failed to create task:", error.response?.data || error.message);
  }
}

async function main() {
  const failedTests = await getFailedTests();

  for (const testName of failedTests) {
    await createClickUpTask(testName);
  }

  console.log(`✅ Total ${failedTests.length} task(s) created for failed tests.`);
}

main();