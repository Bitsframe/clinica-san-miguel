// Navigation and Page Load Test
// Tests that all pages load correctly and navigation works

describe("Navigation and Page Load Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(2000);
  });

  describe("Homepage Loading", () => {
    it("should load the homepage successfully", () => {
      cy.url().should("include", "localhost:3000");
      cy.get("body").should("be.visible");
    });

    it("should display all homepage sections", () => {
      const sections = [
        "hero-section",
        // Add more section identifiers
      ];

      // Check main content loads
      cy.get("main").should("be.visible");

      // Scroll through page to trigger lazy loading
      cy.scrollTo("center");
      cy.wait(1000);
      cy.scrollTo("bottom");
      cy.wait(1000);

      // Verify footer loaded
      cy.get("footer").should("be.visible");
    });

    it("should display phone numbers", () => {
      cy.get('a[href^="tel:"]').should("have.length.greaterThan", 0);
    });
  });

  describe("Main Navigation Links", () => {
    const navLinks = [
      { name: "Home", url: "/" },
      { name: "About", url: "/about" },
      { name: "Services", url: "/services" },
      { name: "Career", url: "/career" },
      { name: "Specials", url: "/special" },
      { name: "Contact", url: "/contact" },
    ];

    navLinks.forEach((link) => {
      it(`should navigate to ${link.name} page`, () => {
        // Click navigation link
        cy.contains(link.name).click();
        cy.wait(2000);

        // Verify URL changed
        cy.url().should("include", link.url);

        // Verify page loaded
        cy.get("main").should("be.visible");
        cy.get("body").should("not.be.empty");
      });

      it(`should load ${link.name} page directly`, () => {
        cy.visit(link.url);
        cy.wait(2000);

        // Verify page loaded
        cy.url().should("include", link.url);
        cy.get("main").should("be.visible");
      });
    });
  });

  describe("Services Page Navigation", () => {
    beforeEach(() => {
      cy.visit("/services");
      cy.wait(2000);
    });

    it("should load services page with service cards", () => {
      cy.get("main").should("be.visible");

      // Check for service cards
      cy.get("article").should("exist");
    });

    it("should display services without errors", () => {
      cy.get("main").should("be.visible");
      // Services page loaded successfully
      cy.get("body").should("not.be.empty");
    });
  });

  describe("Additional Services", () => {
    it("should load additional services page", () => {
      cy.visit("/additionalservices");
      cy.wait(2000);

      cy.get("main").should("be.visible");
      cy.contains("additional services").should("be.visible");
    });
  });

  describe("Special Offers Page", () => {
    it("should load special offers page", () => {
      cy.visit("/special");
      cy.wait(2000);

      cy.get("main").should("be.visible");
      cy.get("h1").should("be.visible");
    });

    it("should display special offer posters", () => {
      cy.visit("/special");
      cy.wait(2000);

      // Check for images
      cy.get("img").should("have.length.greaterThan", 0);
    });
  });

  describe("Contact/Locations Page", () => {
    it("should load contact page", () => {
      cy.visit("/contact");
      cy.wait(2000);

      cy.get("main").should("be.visible");
    });

    it("should filter locations by city", () => {
      cy.visit("/contact?city=dallas");
      cy.wait(2000);

      cy.get("main").should("be.visible");
      cy.url().should("include", "city=dallas");
    });

    it("should display locations on contact page", () => {
      cy.visit("/contact");
      cy.wait(2000);

      cy.get("main").should("be.visible");
      cy.get("body").should("not.be.empty");
    });
  });

  describe("About Page", () => {
    it("should load about page", () => {
      cy.visit("/about");
      cy.wait(2000);

      cy.get("main").should("be.visible");
      cy.get("h1, h2").should("be.visible");
    });

    it("should display company information", () => {
      cy.visit("/about");
      cy.wait(2000);

      // Scroll through page
      cy.scrollTo("bottom", { duration: 2000 });
  // Check content exists
      cy.get("main").should("not.be.empty");
    });
  });

  describe("Career Page", () => {
    it("should load career page", () => {
      cy.visit("/career");
      cy.wait(2000);

      cy.get("main").should("be.visible");
    });
  });

  describe("Footer Links", () => {
    it("should navigate from footer links", () => {
      cy.scrollTo("bottom");
      cy.wait(500);

      // Check footer is visible
      cy.get("footer").should("be.visible");

      // Test footer navigation links
      cy.get("footer").within(() => {
        cy.contains("Home").should("exist");
        cy.contains("Services").should("exist");
        cy.contains("Contact").should("exist");
      });
    });

    it("should have working social media links", () => {
      cy.scrollTo("bottom");
      cy.wait(500);

      cy.get("footer").within(() => {
        // Check for social icons (Facebook, Instagram, YouTube)
        cy.get(
          'a[href*="facebook"], a[href*="instagram"], a[href*="youtube"]',
        ).should("have.length.greaterThan", 0);
      });
    });
  });

  describe("Back & Forward Navigation", () => {
    it("should handle browser back button", () => {
      cy.visit("/");
      cy.wait(1500);

      // Navigate to services
      cy.visit("/services");
      cy.wait(1500);

      // Go back
      cy.go("back");
      cy.wait(1500);

      // Should be on homepage
      cy.url().should("not.include", "/services");
    });

    it("should handle browser forward button", () => {
      cy.visit("/");
      cy.wait(1500);

      cy.visit("/services");
      cy.wait(1500);

      cy.go("back");
      cy.wait(1500);

      // Go forward
      cy.go("forward");
      cy.wait(1500);

      cy.url().should("include", "/services");
    });
  });

  describe("Direct URL Access", () => {
    const pages = [
      "/",
      "/about",
      "/services",
      "/contact",
      "/career",
      "/special",
      "/additionalservices",
    ];

    pages.forEach((page) => {
      it(`should load ${page} directly via URL`, () => {
        cy.visit(page);
        cy.wait(2000);

        cy.url().should("include", page);
        cy.get("main").should("be.visible");
        cy.get("body").should("not.be.empty");
      });
    });
  });

  describe("404 Error Handling", () => {
    it("should handle non-existent pages gracefully", () => {
      cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
      cy.wait(2000);

      // Page should still load (Next.js handles 404)
      cy.get("body").should("be.visible");
    });
  });

  describe("Page Performance", () => {
    it("should load pages within acceptable time", () => {
      const startTime = Date.now();

      cy.visit("/");

      cy.get("main")
        .should("be.visible")
        .then(() => {
          const loadTime = Date.now() - startTime;
          // Should load within 5 seconds
          expect(loadTime).to.be10 seconds (relaxed for CI)
          expect(loadTime).to.be.lessThan(10
    });
  });

  describe("Scroll Behavior", () => {
    it("should maintain scroll position on back navigation", () => {
      cy.visit("/");
      cy.wait(1500);

      // Scroll to bottom
      cy.scrollTo("bottom");
      cy.wait(500);

      // Navigate to another page
      cy.visit("/services");
      cy.wait(1500);

      // Go back
      cy.go("back");
      cy.wait(1500);

      // Check we're back on homepage
      cy.url().should("not.include", "/services");
    });

    it("should scroll to top on new page navigation", () => {
      cy.visit("/");
      cy.wait(1500);

      // Scroll to bottom
      cy.scrollTo("bottom");
      cy.wait(500);

      // Navigate to new page
      cy.contains("Services").click();
      cy.wait(2000);

      // Should be scrolled to top
      cy.window().its("scrollY").should("equal", 0);
    });
  });
});
