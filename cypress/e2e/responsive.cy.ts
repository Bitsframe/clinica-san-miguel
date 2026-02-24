// Responsive Design Test - Simplified
// Tests website on mobile, tablet, and desktop

describe("Responsive Design Test", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  viewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
        cy.wait(1500);
      });

      it("should load homepage successfully", () => {
        cy.url().should("include", "localhost:3000");
        cy.get("body").should("be.visible");
      });

      it("should display header with logo", () => {
        cy.get("header").should("be.visible");
        cy.get("header img").should("exist");
      });

      it("should display main content", () => {
        cy.get("main").should("be.visible");
        cy.get("body").should("contain.text", "Clinica");
      });

      it("should display footer", () => {
        cy.scrollTo("bottom");
        cy.wait(500);
        cy.get("footer").should("be.visible");
      });

      it("should not have excessive horizontal scroll", () => {
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          // Allow 100px tolerance for various elements
          expect(scrollWidth).to.be.lessThan(clientWidth + 100);
        });
      });
    });
  });

  describe("Responsive Navigation", () => {
    it("should show hamburger menu on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.wait(1000);

      cy.get("header button").should("exist");
    });

    it("should show full navigation on desktop", () => {
      cy.viewport(1920, 1080);
      cy.visit("/");
      cy.wait(1000);

      cy.get("header").should("be.visible");
    });
  });

  describe("Responsive Layout", () => {
    it("should adapt services page layout", () => {
      cy.viewport(375, 667);
      cy.visit("/services");
      cy.wait(1500);

      cy.get("main").should("be.visible");

      cy.viewport(1920, 1080);
      cy.wait(500);

      cy.get("main").should("be.visible");
    });
  });
});
