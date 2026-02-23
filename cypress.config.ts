import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "cfoa1c",
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false, // Disabled - Cypress Cloud captures all recordings
    screenshotOnRunFailure: false, // Disabled - Cypress Cloud captures on failure

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Self-hosted reporting
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: false,
      html: true,
      json: true,
      timestamp: "mmddyyyy_HHMMss",
      charts: true,
      reportPageTitle: "Clinicsanmiguel Test Report",
      embeddedScreenshots: true,
      inlineAssets: true,
    },

    setupNodeEvents(on, config) {
      return config;
    },
  },
});
