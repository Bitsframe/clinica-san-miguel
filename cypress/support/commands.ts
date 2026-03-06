/// <reference types="cypress" />

// ========== LANGUAGE COMMANDS ==========

// Custom command to switch to Spanish
Cypress.Commands.add("switchToSpanish", () => {
  // Click the language dropdown button (contains SVG flag)
  cy.get("button").filter(":has(svg)").filter(":visible").first().click();
  cy.wait(500);

  // Click on "Español" option
  cy.contains("Español").click();
  cy.wait(1000);
});

// Custom command to check Spanish content
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
  cy.wait(500);
});

// Custom command to select Spanish from navbar dropdown
Cypress.Commands.add("selectSpanishFromDropdown", () => {
  cy.openLanguageDropdown();
  cy.contains("Español").click();
  cy.wait(1000);
});

// ========== FORM FILLING COMMANDS ==========

/**
 * Fill appointment form with user data
 */
Cypress.Commands.add("fillAppointmentForm", (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  zipcode: string;
}) => {
  // First Name
  cy.get('input[placeholder*="First"], input[placeholder*="first"]')
    .first()
    .clear()
    .type(data.firstName);

  // Last Name
  cy.get('input[placeholder*="Last"], input[placeholder*="last"]')
    .first()
    .clear()
    .type(data.lastName);

  // Email
  cy.get('input[type="email"]').first().clear().type(data.email);

  // Phone
  cy.get(
    'input[placeholder*="555"], input[placeholder*="phone"], input[placeholder*="Phone"], input[placeholder*="Mobile"]'
  )
    .first()
    .clear()
    .type(data.phone);

  // Street Address
  cy.get(
    'input[placeholder*="Address"], input[placeholder*="address"], input[placeholder*="street"], input[placeholder*="Street"]'
  )
    .first()
    .clear()
    .type(data.streetAddress);

  // Wait for state extraction
  cy.wait(800);

  // Zipcode
  cy.get(
    'input[placeholder*="zip"], input[placeholder*="Zip"], input[placeholder*="zipcode"], input[placeholder*="Zipcode"]'
  )
    .first()
    .clear()
    .type(data.zipcode);
});

/**
 * Select date and time for appointment
 */
Cypress.Commands.add("selectDateAndTime", () => {
  // Open date picker
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"], input[placeholder*="Date"]'
  )
    .first()
    .click({ force: true });

  cy.wait(500);

  // Select a date (first available future date)
  cy.get('button:not([disabled])').contains(/\d+/).first().click();

  cy.wait(500);

  // Select time slot
  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time")
    );

    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .not(':contains("Select")')
        .first()
        .then((option) => {
          const value = option.attr("value") || option.text();
          cy.wrap(timeSelect).select(value);
        });
    }
  });
});

/**
 * Select the same date and time (for duplicate testing)
 */
Cypress.Commands.add("selectSameDateAndTime", () => {
  cy.selectDateAndTime();
});

/**
 * Select a different date and time
 */
Cypress.Commands.add("selectDifferentDateAndTime", () => {
  // Open date picker
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"], input[placeholder*="Date"]'
  )
    .first()
    .click({ force: true });

  cy.wait(500);

  // Select a different date (second available date)
  cy.get('button:not([disabled])').contains(/\d+/).eq(1).click();

  cy.wait(500);

  // Select different time slot
  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time")
    );
    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .not(':contains("Select")')
        .eq(1)
        .then((option) => {
          const value = option.attr("value") || option.text();
          cy.wrap(timeSelect).select(value);
        });
    }
  });
});

/**
 * Select a service from the dropdown
 */
Cypress.Commands.add("selectService", (serviceName?: string) => {
  cy.get("select").then(($selects) => {
    const serviceSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("service")
    );

    if (serviceSelect) {
      if (serviceName) {
        cy.wrap(serviceSelect).select(serviceName);
      } else {
        cy.wrap(serviceSelect)
          .find("option")
          .not(':contains("Select")')
          .first()
          .then((option) => {
            const value = option.attr("value") || option.text();
            cy.wrap(serviceSelect).select(value);
          });
      }
    }
  });
});

// ========== TypeScript declarations ==========

declare global {
  namespace Cypress {
    interface Chainable {
      // Language commands
      switchToSpanish(): Chainable<void>;
      checkSpanishContent(): Chainable<void>;
      openLanguageDropdown(): Chainable<void>;
      selectSpanishFromDropdown(): Chainable<void>;

      // Form filling commands
      fillAppointmentForm(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        streetAddress: string;
        zipcode: string;
      }): Chainable<void>;

      // Date and time selection
      selectDateAndTime(): Chainable<void>;
      selectSameDateAndTime(): Chainable<void>;
      selectDifferentDateAndTime(): Chainable<void>;

      // Service selection
      selectService(serviceName?: string): Chainable<void>;
    }
  }
}

export {};