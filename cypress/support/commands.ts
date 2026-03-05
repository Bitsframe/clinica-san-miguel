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

// ========== FORM FILLING COMMANDS FOR DATA INTEGRITY TESTS ==========

/**
 * Fill appointment form with user data
 */
Cypress.Commands.add("fillAppointmentForm", (data: any) => {
  // First Name
  cy.get('input[placeholder*="First"], input[placeholder*="first"]')
    .first()
    .clear()
    .type(data.firstName, { delay: 50 });

  // Last Name
  cy.get('input[placeholder*="Last"], input[placeholder*="last"]')
    .first()
    .clear()
    .type(data.lastName, { delay: 50 });

  // Email
  cy.get('input[type="email"]').first().clear().type(data.email, { delay: 50 });

  // Phone (multiple possible selectors)
  cy.get(
    'input[placeholder*="555"], input[placeholder*="phone"], input[placeholder*="Phone"], input[placeholder*="Mobile"]',
  )
    .first()
    .clear()
    .type(data.phone, { delay: 50 });

  // Street Address
  cy.get(
    'input[placeholder*="Address"], input[placeholder*="address"], input[placeholder*="street"], input[placeholder*="Street"]',
  )
    .first()
    .clear()
    .type(data.streetAddress, { delay: 50 });

  // Wait for state extraction
  cy.wait(800);

  // Zipcode
  cy.get(
    'input[placeholder*="zip"], input[placeholder*="Zip"], input[placeholder*="zipcode"], input[placeholder*="Zipcode"]',
  )
    .first()
    .clear()
    .type(data.zipcode, { delay: 50 });
});

/**
 * Select date and time for appointment
 */
Cypress.Commands.add("selectDateAndTime", () => {
  // Open date picker
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"], input[placeholder*="Date"]',
  )
    .first()
    .click({ force: true });

  cy.wait(500);

  // Select a date (first available future date)
  cy.get(
    '.react-datepicker__day[aria-label], .datepicker button, [class*="datepicker"] button',
  ).then(($dates) => {
    if ($dates.length > 0) {
      cy.wrap($dates).first().click();
    }
  });

  cy.wait(500);

  // Select time slot
  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time"),
    );

    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .eq(1)
        .then((option) => {
          const value = option.attr("value") || "";
          cy.wrap(timeSelect).select(value);
        });
    }
  });
});

/**
 * Select the same date and time (for duplicate testing)
 */
Cypress.Commands.add("selectSameDateAndTime", () => {
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"], input[placeholder*="Date"]',
  )
    .first()
    .click({ force: true });

  cy.wait(500);

  cy.get(
    '.react-datepicker__day[aria-label], .datepicker button, [class*="datepicker"] button',
  ).then(($dates) => {
    if ($dates.length > 0) {
      cy.wrap($dates).first().click();
    }
  });

  cy.wait(500);

  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time"),
    );
    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .eq(1)
        .then((option) => {
          const value = option.attr("value") || "";
          cy.wrap(timeSelect).select(value);
        });
    }
  });
});

/**
 * Select a different date and time
 */
Cypress.Commands.add("selectDifferentDateAndTime", () => {
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"], input[placeholder*="Date"]',
  )
    .first()
    .click({ force: true });

  cy.wait(500);

  cy.get(
    '.react-datepicker__day[aria-label], .datepicker button, [class*="datepicker"] button',
  ).then(($dates) => {
    if ($dates.length > 1) {
      cy.wrap($dates).eq(1).click(); // Click 2nd date for variation
    }
  });

  cy.wait(500);

  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time"),
    );
    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .eq(2)
        .then((option) => {
          const value = option.attr("value") || "";
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
      select.textContent?.toLowerCase().includes("service"),
    );

    if (serviceSelect) {
      if (serviceName) {
        cy.wrap(serviceSelect).select(serviceName);
      } else {
        cy.wrap(serviceSelect)
          .find("option")
          .eq(1)
          .then((option) => {
            const value = option.attr("value") || "";
            cy.wrap(serviceSelect).select(value);
          });
      }
    }
  });
});

// ========== TypeScript declarations for custom commands ==========

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
      selectDateAndTime(): Chainable<any>;
      selectSameDateAndTime(): Chainable<void>;
      selectDifferentDateAndTime(): Chainable<void>;

      // Service selection
      selectService(serviceName?: string): Chainable<void>;
    }
  }
}

export {};
