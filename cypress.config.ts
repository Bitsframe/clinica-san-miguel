import { defineConfig } from "cypress";

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
      return config;
    },
  },
});
