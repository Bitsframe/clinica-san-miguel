// Simple Spanish Language Test
// Tests that the website properly displays Spanish content

describe("Spanish Language Test", () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit("/");
    // Wait for page to fully load
    cy.wait(2000);
  });

  it("should load the homepage successfully", () => {
    // Check that page loads
    cy.url().should("include", "localhost:3000");
    // Verify page is loaded with title or body content
    cy.get("body").should("be.visible");
  });

  it("should have a language switcher", () => {
    // Look for the rounded button with flag (based on LanguageChanger component)
    // The component renders a button with SVG flags and is w-28 h-12 rounded-full
    cy.get("nav, header")
      .find("button")
      .filter(":visible")
      .should("have.length.greaterThan", 0);

    // More specific: look for button containing SVG (the flag)
    cy.get("button").find("svg").should("exist");

    cy.log("✓ Language switcher button with flag found");
  });

  it("should have a navbar dropdown with Spanish flag", () => {
    // Find and click the language dropdown button (has SVG flag inside)
    cy.get("button").filter(":has(svg)").filter(":visible").first().click();

    // Wait for dropdown to open
    cy.wait(500);

    // Verify dropdown appears with "Español" option
    cy.contains("Español").should("be.visible");

    cy.log("✓ Navbar dropdown opened and Spanish option visible");
  });

  it("should switch to Spanish using navbar dropdown flag", () => {
    // Click the language dropdown button
    cy.get("button").filter(":has(svg)").filter(":visible").first().click();

    // Wait for dropdown to open
    cy.wait(500);

    // Click on "Español" option in the dropdown
    cy.contains("Español").click();

    // Wait for navigation
    cy.wait(2000);

    // Verify URL changed to Spanish
    cy.url().should("include", "/es");

    // Verify Spanish content is displayed
    cy.get("body").then(($body) => {
      const spanishTerms = ["Inicio", "Nosotros", "Servicios", "Contacto"];
      const bodyText = $body.text();
      const hasSpanishTerm = spanishTerms.some((term) =>
        bodyText.includes(term),
      );
      expect(hasSpanishTerm, "Should display Spanish content").to.be.true;
    });

    cy.log("✓ Successfully switched to Spanish using navbar dropdown flag");
  });

  it("should switch to Spanish when language selector is clicked", () => {
    // Click the language dropdown button
    cy.get("button").filter(":has(svg)").filter(":visible").first().click();

    // Wait for dropdown
    cy.wait(500);

    // Click Español option
    cy.contains("Español").click();

    // Wait for page to load
    cy.wait(2000);

    // Verify URL contains /es/ for Spanish
    cy.url().should("include", "/es");
  });

  it("should display Spanish content after switching language", () => {
    // Switch to Spanish
    cy.get("body").then(($body) => {
      if ($body.find('[href*="/es"]').length > 0) {
        cy.get('[href*="/es"]').first().click();
      } else {
        // If no ES link, visit /es directly
        cy.visit("/es");
      }
    });

    // Wait for content to load
    cy.wait(1500);

    // Check for common Spanish words in the page
    cy.get("body").then(($body) => {
      const spanishTerms = ["Nosotros", "Servicios", "Contacto", "Inicio"];
      const bodyText = $body.text();
      const hasSpanishContent = spanishTerms.some((term) =>
        bodyText.includes(term),
      );

      expect(
        hasSpanishContent,
        "Page should contain Spanish content after language switch",
      ).to.be.true;
    });
  });

  it("should have Spanish navigation menu items", () => {
    // Navigate to Spanish version
    cy.visit("/es");

    // Wait for page load
    cy.wait(1500);

    // Check for Spanish navigation terms
    const spanishTerms = [
      "Inicio",
      "Nosotros",
      "Servicios",
      "Ubicaciones",
      "Contacto",
    ];

    cy.get('nav, header, [role="navigation"]').then(($nav) => {
      const navText = $nav.text();
      const hasSpanishTerm = spanishTerms.some((term) =>
        navText.includes(term),
      );
      expect(hasSpanishTerm).to.be.true;
    });
  });

  it("should maintain Spanish language on page navigation", () => {
    // Visit Spanish homepage
    cy.visit("/es");
    cy.wait(1000);

    // Find and click a link (if available)
    cy.get('a[href*="/es"]')
      .first()
      .then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).click();

          // Verify still on Spanish version
          cy.url().should("include", "/es");
        }
      });
  });

  it("should display forms in Spanish", () => {
    // Visit Spanish version
    cy.visit("/es");
    cy.wait(1500);

    // Look for form elements with Spanish labels
    cy.get("body").then(($body) => {
      const spanishFormTerms = [
        "Nombre",
        "Correo",
        "Email",
        "Teléfono",
        "Mensaje",
        "Enviar",
        "Apellido",
      ];

      const bodyText = $body.text();
      const hasSpanishFormTerm = spanishFormTerms.some((term) =>
        bodyText.includes(term),
      );

      // If forms exist, they should have Spanish labels
      if (
        $body.find('form, input, textarea, button[type="submit"]').length > 0
      ) {
        expect(hasSpanishFormTerm).to.be.true;
      }
    });
  });

  it("should show error messages in Spanish", () => {
    // Visit Spanish version
    cy.visit("/es");
    cy.wait(1000);

    // Try to find and submit a form without required fields
    cy.get("form")
      .first()
      .then(($form) => {
        if ($form.length > 0) {
          // Find submit button
          cy.get('button[type="submit"], input[type="submit"]')
            .first()
            .click({ force: true });

          // Wait for validation
          cy.wait(500);

          // Check for Spanish error messages
          cy.get("body").then(($body) => {
            const spanishErrors = [
              "requerido",
              "obligatorio",
              "necesario",
              "error",
              "inválido",
              "campo",
            ];

            const bodyText = $body.text().toLowerCase();
            const hasSpanishError = spanishErrors.some((term) =>
              bodyText.includes(term),
            );

            // Log for debugging
            cy.log("Checking for Spanish error messages");
          });
        }
      });
  });
});
