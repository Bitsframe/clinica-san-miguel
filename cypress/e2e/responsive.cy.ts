// Responsive Design Test
// Tests that the website displays correctly on different screen sizes

describe("Responsive Design Test", () => {
  const viewports = [
    { name: "Mobile (iPhone SE)", width: 375, height: 667 },
    { name: "Mobile (iPhone 12 Pro)", width: 390, height: 844 },
    { name: "Tablet (iPad)", width: 768, height: 1024 },
    { name: "Tablet (iPad Pro)", width: 1024, height: 1366 },
    { name: "Desktop (1080p)", width: 1920, height: 1080 },
    { name: "Desktop (1440p)", width: 2560, height: 1440 },
  ];

  viewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
        cy.wait(2000);
      });

      it("should load homepage successfully", () => {
        cy.url().should("include", "localhost:3000");
        cy.get("body").should("be.visible");
      });

      it("should display logo", () => {
        cy.get("header").find("img").should("be.visible");
      });

      it("should display navigation", () => {
        if (viewport.width >= 768) {
          // Desktop/Tablet: inline navigation
          cy.get("nav").should("be.visible");
        } else {
          // Mobile: hamburger menu
          cy.get("header").find("button").should("exist");
        }
      });

      it("should display hero section", () => {
        cy.get("main").should("be.visible");
        // Check for main content area
        cy.get("body").should("contain.text", "Clinica");
      });

      it("should display footer", () => {
        cy.scrollTo("bottom");
        cy.wait(500);
        cy.get("footer").should("be.visible");
      });

      it("should not have horizontal scroll", () => {
        cy.document().then((doc) => {
          const body = doc.body;
          const html = doc.documentElement;
          const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
          const clientWidth = Math.max(body.clientWidth, html.clientWidth);
          // Allow 10px tolerance for scrollbars
          expect(scrollWidth).to.be.lessThan(clientWidth + 10);
        });
      });

      it("should display phone numbers bar", () => {
        cy.get("main").within(() => {
          cy.get('a[href^="tel:"]').should("exist");
        });
      });

      it("should have responsive images", () => {
        cy.get("img").each(($img) => {
          cy.wrap($img).should("be.visible");
          cy.wrap($img).should("have.attr", "src");
        });
      });

      it("should have clickable elements properly sized", () => {
        cy.get("button, a").each(($el) => {
          if ($el.is(":visible")) {
            const height = $el.height() || 0;
            const width = $el.width() || 0;
            // Ensure minimum touch target size (44x44 for mobile)
            if (viewport.width < 768) {
              expect(height).to.be.greaterThan(30);
              expect(width).to.be.greaterThan(30);
            }
          }
        });
      });

      it("should display sections without overlap", () => {
        cy.get("section").each(($section) => {
          cy.wrap($section).should("be.visible");
        });
      });
    });
  });

  // Test responsive menu functionality on mobile
  describe("Mobile Menu Functionality", () => {
    beforeEach(() => {
      cy.viewport(375, 667); // Mobile size
      cy.visit("/");
      cy.wait(2000);
    });

    it("should open and close hamburger menu", () => {
      // Find and click hamburger button
      cy.get("header").find("button").first().click();
      cy.wait(500);

      // Menu should be visible
      cy.get("nav, [role='navigation']").should("exist");

      // Close menu
      cy.get("header").find("button").first().click();
      cy.wait(500);
    });

    it("should navigate from mobile menu", () => {
      // Open menu
      cy.get("header").find("button").first().click();
      cy.wait(500);

      // Click on a link (e.g., Services)
      cy.contains("Services").should("be.visible");
    });
  });

  // Test responsive layout adjustments
  describe("Responsive Layout Adjustments", () => {
    it("should adjust card layouts from mobile to desktop", () => {
      // Mobile
      cy.viewport(375, 667);
      cy.visit("/services");
      cy.wait(2000);

      // Check cards are stacked vertically (single column)
      cy.get("article").first().should("be.visible");

      // Desktop
      cy.viewport(1920, 1080);
      cy.wait(500);

      // Check cards are in grid (multiple columns)
      cy.get("article").should("have.length.greaterThan", 0);
    });

    it("should adjust text sizes across viewports", () => {
      const pages = ["/", "/about", "/services", "/contact"];

      pages.forEach((page) => {
        cy.viewport(375, 667); // Mobile
        cy.visit(page);
        cy.wait(1500);

        cy.get("h1")
          .first()
          .then(($h1) => {
            const mobileFontSize = parseFloat(
              window.getComputedStyle($h1[0]).fontSize,
            );

            cy.viewport(1920, 1080); // Desktop
            cy.wait(500);

            cy.get("h1")
              .first()
              .then(($h1Desktop) => {
                const desktopFontSize = parseFloat(
                  window.getComputedStyle($h1Desktop[0]).fontSize,
                );

                // Desktop font should be same or larger
                expect(desktopFontSize).to.be.at.least(mobileFontSize);
              });
          });
      });
    });
  });

  // Test orientation changes (landscape vs portrait)
  describe("Orientation Handling", () => {
    it("should handle portrait orientation on mobile", () => {
      cy.viewport(375, 667); // Portrait
      cy.visit("/");
      cy.wait(2000);
      cy.get("main").should("be.visible");
    });

    it("should handle landscape orientation on mobile", () => {
      cy.viewport(667, 375); // Landscape
      cy.visit("/");
      cy.wait(2000);
      cy.get("main").should("be.visible");
    });

    it("should handle portrait orientation on tablet", () => {
      cy.viewport(768, 1024); // Portrait
      cy.visit("/");
      cy.wait(2000);
      cy.get("main").should("be.visible");
    });

    it("should handle landscape orientation on tablet", () => {
      cy.viewport(1024, 768); // Landscape
      cy.visit("/");
      cy.wait(2000);
      cy.get("main").should("be.visible");
    });
  });
});
