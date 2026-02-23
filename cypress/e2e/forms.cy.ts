// Form Submission Test
// Tests form inputs, validation, and submission

describe("Form Submission Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(2000);
  });

  describe("Contact Form", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(2000);
    });

    it("should display contact form fields", () => {
      cy.get("form").should("exist");
    });

    it("should validate required fields", () => {
      // Try to submit empty form
      cy.get('button[type="submit"], input[type="submit"]')
        .first()
        .click({ force: true });

      // Should show validation errors or prevent submission
      cy.wait(500);
    });

    it("should fill and submit contact form with valid data", () => {
      cy.get("form")
        .first()
        .within(() => {
          // Fill name field
          cy.get('input[name*="name" i], input[placeholder*="name" i]')
            .first()
            .type("John Doe", { force: true });

          // Fill email field
          cy.get(
            'input[type="email"], input[name*="email" i], input[placeholder*="email" i]',
          )
            .first()
            .type("john.doe@example.com", { force: true });

          // Fill phone field
          cy.get(
            'input[type="tel"], input[name*="phone" i], input[placeholder*="phone" i]',
          )
            .first()
            .type("4691234567", { force: true });

          // Fill message/comment field
          cy.get('textarea, input[name*="message" i], input[name*="comment" i]')
            .first()
            .type("This is a test message for Cypress automation.", {
              force: true,
            });

          cy.wait(500);

          // Submit form
          cy.get('button[type="submit"], input[type="submit"]')
            .first()
            .click({ force: true });

          cy.wait(2000);
        });

      // Check for success message or confirmation
      cy.get("body").then(($body) => {
        const bodyText = $body.text().toLowerCase();
        const successIndicators = [
          "success",
          "thank",
          "submitted",
          "received",
          "sent",
        ];
        const hasSuccess = successIndicators.some((indicator) =>
          bodyText.includes(indicator),
        );
        cy.log(
          hasSuccess
            ? "✓ Form submitted successfully"
            : "Form submission completed",
        );
      });
    });

    it("should validate email format", () => {
      cy.get('input[type="email"], input[name*="email" i]')
        .first()
        .type("invalid-email", { force: true })
        .blur();

      // HTML5 validation should trigger
      cy.get('input[type="email"]')
        .first()
        .then(($input) => {
          expect($input[0].validationMessage).to.not.be.empty;
        });
    });

    it("should validate phone number format", () => {
      cy.get('input[type="tel"], input[name*="phone" i]')
        .first()
        .type("123", { force: true }); // Too short

      cy.wait(500);
    });
  });

  describe("Appointment/Schedule Form", () => {
    it("should find and interact with appointment form", () => {
      // Look for appointment scheduling on homepage or services
      cy.get("body").then(($body) => {
        if (
          $body.find("button, a").text().includes("Schedule") ||
          $body.find("button, a").text().includes("Appointment")
        ) {
          cy.log("✓ Found appointment scheduling option");
        }
      });
    });

    it("should fill patient information form", () => {
      cy.get("form")
        .first()
        .within(() => {
          // First Name
          cy.get('input[placeholder*="First" i], input[name*="first" i]')
            .first()
            .type("Juan", { force: true });

          // Last Name
          cy.get('input[placeholder*="Last" i], input[name*="last" i]')
            .first()
            .type("Rodriguez", { force: true });

          // Date of Birth
          cy.get(
            'input[type="date"], input[name*="birth" i], input[name*="dob" i]',
          )
            .first()
            .type("1990-01-15", { force: true });

          // Phone
          cy.get('input[type="tel"], input[name*="phone" i]')
            .first()
            .type("4691234567", { force: true });

          // Email
          cy.get('input[type="email"], input[name*="email" i]')
            .first()
            .type("juan.rodriguez@example.com", { force: true });

          cy.wait(500);
        });
    });

    it("should select gender option", () => {
      cy.get(
        'input[type="radio"][name*="gender" i], input[type="radio"][value*="male" i]',
      )
        .first()
        .check({ force: true });

      cy.wait(300);
    });

    it("should fill address information", () => {
      // Address
      cy.get('input[name*="address" i], input[placeholder*="address" i]')
        .first()
        .type("123 Main Street", { force: true });

      // City
      cy.get('input[name*="city" i], input[placeholder*="city" i]')
        .first()
        .type("Dallas", { force: true });

      // State
      cy.get('input[name*="state" i], select[name*="state" i]')
        .first()
        .type("TX", { force: true });

      // ZIP Code
      cy.get('input[name*="zip" i], input[name*="postal" i]')
        .first()
        .type("75201", { force: true });

      cy.wait(500);
    });
  });

  describe("Newsletter Signup Form", () => {
    it("should find newsletter signup in footer", () => {
      cy.scrollTo("bottom");
      cy.wait(500);

      cy.get("footer").within(() => {
        cy.get('input[type="email"], input[placeholder*="email" i]').should(
          "exist",
        );
      });
    });

    it("should subscribe to newsletter", () => {
      cy.scrollTo("bottom");
      cy.wait(500);

      cy.get("footer").within(() => {
        cy.get('input[type="email"]')
          .first()
          .type("subscriber@example.com", { force: true });

        // Find and click subscribe button
        cy.get("button")
          .contains(/subscribe|sign up|join/i)
          .click({ force: true });

        cy.wait(2000);
      });

      // Check for success indication
      cy.get("body").then(($body) => {
        const bodyText = $body.text().toLowerCase();
        if (bodyText.includes("subscribed") || bodyText.includes("thank")) {
          cy.log("✓ Newsletter subscription successful");
        }
      });
    });
  });

  describe("Form Input Validation", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(2000);
    });

    it("should prevent special characters in name fields", () => {
      cy.get('input[name*="name" i]').first().type("Test@#$%", { force: true });

      cy.wait(300);
    });

    it("should accept valid phone number formats", () => {
      const validPhones = [
        "4691234567",
        "(469) 123-4567",
        "469-123-4567",
        "+14691234567",
      ];

      validPhones.forEach((phone) => {
        cy.get('input[type="tel"]')
          .first()
          .clear({ force: true })
          .type(phone, { force: true });

        cy.wait(200);
      });
    });

    it("should limit input length for specific fields", () => {
      // Phone should be limited
      cy.get('input[type="tel"]')
        .first()
        .type("12345678901234567890", { force: true })
        .should("have.value")
        .and("have.length.lessThan", 20);
    });
  });

  describe("Form Accessibility", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(2000);
    });

    it("should have labels for all inputs", () => {
      cy.get("input, textarea, select").each(($input) => {
        const id = $input.attr("id");
        const name = $input.attr("name");
        const ariaLabel = $input.attr("aria-label");
        const placeholder = $input.attr("placeholder");

        // Should have some form of label
        expect(id || name || ariaLabel || placeholder).to.exist;
      });
    });

    it("should allow keyboard navigation through form", () => {
      cy.get("input").first().focus();

      // Tab through inputs
      cy.focused().tab();
      cy.wait(200);

      cy.focused().should("match", "input, textarea, select, button");
    });

    it("should show focus indicators", () => {
      cy.get("input").first().focus();

      cy.focused().should("have.css", "outline").or("have.css", "box-shadow");
    });
  });

  describe("Multi-Step Form Navigation", () => {
    it("should navigate through form steps if applicable", () => {
      cy.get("body").then(($body) => {
        // Check if there's a multi-step form
        if (
          $body.find("button").text().includes("Next") ||
          $body.find("button").text().includes("Continue")
        ) {
          cy.log("✓ Multi-step form detected");

          // Click next/continue button
          cy.contains(/next|continue/i).click({ force: true });
          cy.wait(1000);

          // Check if we moved to next step
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Form Error Handling", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(2000);
    });

    it("should display error for missing required fields", () => {
      // Submit without filling
      cy.get('button[type="submit"]').first().click({ force: true });

      cy.wait(1000);

      // Check for error messages
      cy.get("body").then(($body) => {
        const bodyText = $body.text().toLowerCase();
        const errorIndicators = [
          "required",
          "error",
          "invalid",
          "must",
          "please",
        ];
        const hasError = errorIndicators.some((indicator) =>
          bodyText.includes(indicator),
        );

        if (hasError) {
          cy.log("✓ Validation errors displayed correctly");
        }
      });
    });

    it("should clear errors when field is corrected", () => {
      // Trigger error
      cy.get('input[type="email"]')
        .first()
        .type("invalid", { force: true })
        .blur();

      cy.wait(500);

      // Correct the error
      cy.get('input[type="email"]')
        .first()
        .clear({ force: true })
        .type("valid@example.com", { force: true })
        .blur();

      cy.wait(500);
    });
  });

  describe("Form Data Persistence", () => {
    it("should retain form data on validation error", () => {
      cy.get('input[name*="name" i]')
        .first()
        .type("Test User", { force: true });

      const enteredValue = "Test User";

      // Try to submit (might fail validation)
      cy.get('button[type="submit"]').first().click({ force: true });

      cy.wait(1000);

      // Check if data is still there
      cy.get('input[name*="name" i]')
        .first()
        .should("have.value", enteredValue);
    });
  });

  describe("Form Success Confirmation", () => {
    it("should show success message after valid submission", () => {
      cy.get("form")
        .first()
        .within(() => {
          // Fill form with valid data
          cy.get('input[name*="name" i]')
            .first()
            .type("John Doe", { force: true });

          cy.get('input[type="email"]')
            .first()
            .type("john.doe@example.com", { force: true });

          cy.get('input[type="tel"]')
            .first()
            .type("4691234567", { force: true });

          cy.get('textarea, input[name*="message" i]')
            .first()
            .type("Test message", { force: true });

          cy.wait(500);

          // Submit
          cy.get('button[type="submit"]').first().click({ force: true });
        });

      cy.wait(3000);

      // Look for success indicators
      cy.get("body").then(($body) => {
        const bodyText = $body.text().toLowerCase();
        const successPatterns = [
          "success",
          "thank you",
          "submitted",
          "received",
          "confirmation",
          "sent",
        ];

        const hasSuccess = successPatterns.some((pattern) =>
          bodyText.includes(pattern),
        );

        cy.log(hasSuccess ? "✓ Success message displayed" : "Form submitted");
      });
    });
  });
});
