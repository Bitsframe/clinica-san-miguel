// Custom Cypress Commands
// Add your custom commands here

// Example: Custom command to switch language
Cypress.Commands.add("switchToSpanish", () => {
  // Click the language dropdown button (contains SVG flag)
  cy.get("button").filter(":has(svg)").filter(":visible").first().click();
  cy.wait(500);

  // Click on "Español" option
  cy.contains("Español").click();
  cy.wait(1000);
});

// Example: Custom command to check Spanish content
Cypress.Commands.add("checkSpanishContent", () => {
  const spanishTerms = [
    "Nosotros",
    "Servicios",
    "Contacto",
    "Inicio",
    "Ubicaciones",
  ];
  cy.get("body").then(($body) => {
    const bodyText = $body.text();
    const hasSpanishTerm = spanishTerms.some((term) => bodyText.includes(term));
    expect(hasSpanishTerm).to.be.true;
  });
});

// Custom command to open navbar language dropdown
Cypress.Commands.add("openLanguageDropdown", () => {
  // Find button with SVG (the flag button)
  cy.get("button").filter(":has(svg)").filter(":visible").first().click();
  cy.wait(500); // Wait for dropdown to open
});

// Custom command to select Spanish from navbar dropdown
Cypress.Commands.add("selectSpanishFromDropdown", () => {
  cy.openLanguageDropdown();

  // Click on "Español" option in the dropdown
  cy.contains("Español").click();
  cy.wait(1000);
});

// TypeScript declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      switchToSpanish(): Chainable<void>;
      checkSpanishContent(): Chainable<void>;
      openLanguageDropdown(): Chainable<void>;
      selectSpanishFromDropdown(): Chainable<void>;
    }
  }
}

export {};
