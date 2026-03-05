// Form Submission Test - Simplified
// Tests basic form functionality without overly complex selectors

describe("Form Submission Test", () => {
  describe("Contact Form", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(1500);
    });

    it("should display contact form", () => {
      cy.get("form").should("exist").and("be.visible");
    });

    it("should have email input field", () => {
      cy.get('input[type="email"]').should("exist");
    });

    it("should have submit button", () => {
      cy.get('button[type="submit"]').should("exist");
    });

    it("should validate email format", () => {
      cy.get('input[type="email"]')
        .first()
        .type("invalid-email")
        .blur()
        .then(($input) => {
          // HTML5 validation should trigger
          const input = $input[0] as HTMLInputElement;
          expect(input.validationMessage).to.not.be.empty;
        });
    });

    it("should accept valid email", () => {
      cy.get('input[type="email"]')
        .first()
        .type("test@example.com")
        .should("have.value", "test@example.com");
    });
  });

  describe("Newsletter Signup", () => {
    it("should find newsletter form in footer", () => {
      cy.visit("/");
      cy.scrollTo("bottom");
      cy.wait(1000);

      cy.get("footer").within(() => {
        cy.get('input[type="email"]').should("exist");
        cy.get("button").should("exist");
      });
    });
  });

  describe("Form Accessibility", () => {
    beforeEach(() => {
      cy.visit("/contact");
      cy.wait(1000);
    });

    it("should allow keyboard focus on inputs", () => {
      cy.get("input").first().focus().should("have.focus");
    });

    it("should have form elements visible", () => {
      cy.get("form").should("be.visible");
      cy.get("form input").should("have.length.greaterThan", 0);
    });
  });
});
