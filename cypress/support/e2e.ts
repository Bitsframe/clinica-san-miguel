/// <reference types="cypress" />

// Import custom Cypress commands
import "./commands";

// Handle uncaught exceptions to prevent test failures from third-party errors
Cypress.on("uncaught:exception", (err, runnable) => {
  console.warn("Uncaught exception:", err.message);
  return false;
});

// Before each test - clean state
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
