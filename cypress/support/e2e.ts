// Cypress Support File
// This file runs before every test file

// Import Cypress commands
import "./commands";

// Prevent uncaught exceptions from failing tests
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent the error from failing the test
  // Useful for third-party script errors
  return false;
});

// Add custom configuration
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});
