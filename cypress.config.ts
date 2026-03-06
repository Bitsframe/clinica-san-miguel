import { defineConfig } from "cypress";
import { supabaseTasks } from "./cypress/support/tasks";

/**
 * Cypress Configuration for Supabase Contact Form Tests
 *
 * ENVIRONMENT VARIABLES:
 * - CYPRESS_TEST_EMAIL: Provide a custom email for testing (e.g., user@example.com)
 *   Usage: CYPRESS_TEST_EMAIL=john.doe@company.com npx cypress run
 *   If not provided, tests will generate unique emails with timestamps
 *
 * Example commands:
 * 1. Run tests with default generated emails:
 *    npx cypress run cypress/e2e/supabase-contact-form.cy.ts
 *
 * 2. Run tests with custom email:
 *    CYPRESS_TEST_EMAIL=testuser@example.com npx cypress run cypress/e2e/supabase-contact-form.cy.ts
 *
 * 3. Open Cypress UI with custom email:
 *    CYPRESS_TEST_EMAIL=testuser@example.com npx cypress open
 */

export default defineConfig({
  projectId: "cfoa1c",
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: false,

    defaultCommandTimeout: 20000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 1,
      openMode: 0,
    },

    // Cypress Cloud built-in reporting (faster)
    reporter: "spec",

    setupNodeEvents(on, config) {
      // Register Supabase tasks
      on("task", supabaseTasks);
      return config;
    },
  },
});
