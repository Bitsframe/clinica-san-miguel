const axios = require("axios");
const fs = require("fs");

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

async function getFailedTestName() {
  try {
    const report = JSON.parse(fs.readFileSync("cypress-report.json", "utf8"));

    for (const run of report.runs || []) {
      for (const test of run.tests || []) {
        if (test.state === "failed") {
          return test.title.join(" > ");
        }
      }
    }

    return "Unknown Test Failure";
  } catch (err) {
    return "Test Failure (Could not parse report)";
  }
}

async function createClickUpTask(testName) {
  const taskData = {
    name: `❌ ${testName}`,
    description: `Cypress test failed:\n\n${testName}`,
  };

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

  console.log(`✅ Task created: ${response.data.name}`);
}

async function main() {
  const failedTestName = await getFailedTestName();
  await createClickUpTask(failedTestName);
}

main();