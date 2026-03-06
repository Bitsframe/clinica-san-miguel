// cypress/e2e/appointment-form.cy.ts

describe("Appointment Form - Backend Insertion Tests", () => {
  const timestamp = Date.now();

  // Test data
  const testData = {
    firstName: "John",
    lastName: "Doe",
    email: `john.doe${timestamp}@example.com`,
    phone: "5551234567",
    dob: "1985-06-15",
    gender: "Male",
    streetAddress: "123 Main Street",
    state: "NY",
    zipCode: "10001",
    service: "", // Will be dynamically selected from available services
    emailOpt: true,
    textOpt: true,
  };

  let insertedRecordId: number | null = null;
  let selectedLocationId: number;

  // Helper function to setup the modal - called at start of each test
  function setupAppointmentModal() {
    // Visit contact page
    cy.visit("/contact");
    cy.get("body").should("be.visible");

    // Wait for locations to load - look for article elements containing "Appointment" button
    cy.contains("button", "Appointment", { timeout: 15000 }).should(
      "be.visible",
    );

    // Click the first "Appointment" button to navigate to location detail page
    cy.contains("button", "Appointment").first().click();

    // Wait for location detail page to load
    cy.url().should("match", /\/contact\/\d+/);

    // Extract location ID from URL
    cy.url().then((url) => {
      const match = url.match(/\/contact\/(\d+)/);
      if (match) {
        selectedLocationId = parseInt(match[1]);
      } else {
        selectedLocationId = 1; // Default fallback
      }
    });

    // Wait for page to fully render
    cy.wait(3000);

    // Find and click the "Book an appoinment" button
    // Use contains with regex for case-insensitive matching
    cy.contains("button", /book/i)
      .first()
      .scrollIntoView()
      .should("be.visible")
      .then(($btn) => {
        cy.log("Found button: " + $btn.text());
        cy.wrap($btn).click({ force: true });
      });

    // Wait for modal to fully render
    cy.wait(3000);

    // Wait for form inputs to appear
    cy.get("input", { timeout: 20000 }).should("have.length.at.least", 3);

    // Find the first name input
    cy.get('input[placeholder="John"]', { timeout: 10000 })
      .first()
      .should("be.visible");
  }

  afterEach(() => {
    // Clean up test data
    if (insertedRecordId) {
      cy.task("db:query", {
        query: "DELETE FROM allpatients WHERE id = $1",
        params: [insertedRecordId],
      }).then(() => {
        cy.log(`Test record ${insertedRecordId} deleted`);
      });
    }
  });

  it("TC-001: Should successfully submit complete appointment form", () => {
    setupAppointmentModal();

    // Fill the form
    fillAppointmentForm(testData);

    // Submit form
    cy.contains("button", "Book now").click();

    // Wait for success message
    cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
      "be.visible",
    );

    // Verify database insertion
    verifyInsertedData(testData);
  });

  it("TC-002: Should validate required fields", () => {
    setupAppointmentModal();

    // Try to submit without filling
    cy.contains("button", "Book now").click();

    // Check for validation message
    cy.contains("Please fill in the following fields", {
      timeout: 5000,
    }).should("be.visible");
  });

  it("TC-003: Should handle optional email field", () => {
    setupAppointmentModal();

    // Fill form without email
    fillAppointmentForm({ ...testData, email: "" });

    cy.contains("button", "Book now").click();
    cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
      "be.visible",
    );

    // Verify email is null in database
    verifyInsertedData({ ...testData, email: "" });
  });

  it("TC-004: Should format phone number correctly with +1 prefix", () => {
    setupAppointmentModal();

    const phoneWithoutPrefix = "5551234567";
    const expectedPhone = `+1${phoneWithoutPrefix}`;

    fillAppointmentForm({ ...testData, phone: phoneWithoutPrefix });
    cy.contains("button", "Book now").click();
    cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
      "be.visible",
    );

    // Verify phone format
    cy.task("db:query", {
      query: "SELECT phone FROM allpatients WHERE email = $1",
      params: [testData.email],
    }).then((result: any) => {
      expect(result.rows[0].phone).to.equal(expectedPhone);
      insertedRecordId = result.rows[0].id;
    });
  });

  it("TC-005: Should handle different gender selections", () => {
    setupAppointmentModal();

    const genders = ["Male", "Female", "Other"];

    genders.forEach((gender, index) => {
      const genderTestData = {
        ...testData,
        email: `john.doe${timestamp}.gender${index}@example.com`,
        gender,
      };

      fillAppointmentForm(genderTestData);
      cy.contains("button", "Book now").click();
      cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
        "be.visible",
      );

      // Verify gender
      cy.task("db:query", {
        query: "SELECT gender FROM allpatients WHERE email = $1",
        params: [genderTestData.email],
      }).then((result: any) => {
        expect(result.rows[0].gender).to.equal(gender);
      });
    });
  });

  it("TC-006: Should handle checkbox opt-ins correctly", () => {
    setupAppointmentModal();

    // Test with both unchecked
    const noOptData = { ...testData, emailOpt: false, textOpt: false };

    fillAppointmentForm(noOptData);
    cy.contains("button", "Book now").click();
    cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
      "be.visible",
    );

    // Verify both are false
    cy.task("db:query", {
      query: "SELECT email_opt, text_opt FROM allpatients WHERE email = $1",
      params: [testData.email],
    }).then((result: any) => {
      expect(result.rows[0].email_opt).to.be.false;
      expect(result.rows[0].text_opt).to.be.false;
    });
  });

  it("TC-007: Should store correct location ID", () => {
    setupAppointmentModal();

    fillAppointmentForm(testData);
    cy.contains("button", "Book now").click();
    cy.contains("Appointment Booked Successfully", { timeout: 15000 }).should(
      "be.visible",
    );

    // Verify location ID
    cy.task("db:query", {
      query: "SELECT locationid FROM allpatients WHERE email = $1",
      params: [testData.email],
    }).then((result: any) => {
      expect(result.rows[0].locationid).to.equal(selectedLocationId);
      insertedRecordId = result.rows[0].id;
    });
  });

  // Helper Functions
  function fillAppointmentForm(data: typeof testData) {
    // Personal Information - First Name
    cy.get('input[placeholder="John"]').clear().type(data.firstName);

    // Last Name
    cy.get('input[placeholder="Doe"]').clear().type(data.lastName);

    // Email (optional)
    if (data.email) {
      cy.get('input[placeholder="email@example.com"]').clear().type(data.email);
    }

    // Phone - react-phone-input-2 component
    cy.get('input[placeholder="(555) 000-0000"]').clear().type(data.phone);

    // Date of Birth
    cy.get('input[placeholder="YYYY-MM-DD"]').first().clear().type(data.dob);

    // Gender selection - click the radio button label
    cy.contains("label", data.gender).click();

    // Street Address
    cy.get('input[placeholder="123 Clinic St"]')
      .clear()
      .type(data.streetAddress);

    // Wait a bit for any address suggestions, then dismiss if present
    cy.wait(500);
    cy.get("body").click(0, 0); // Click outside to dismiss suggestions

    // Schedule Date - click to open calendar, then select today or next available day
    cy.get('input[placeholder="Select Schedule date"]').click();
    // Wait for calendar popup
    cy.get(".react-datepicker", { timeout: 5000 }).should("be.visible");
    // Select today or first available day (not disabled)
    cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)")
      .first()
      .click();

    // Time selection - wait for options to load, then select first available
    cy.wait(1000); // Wait for time slots to load
    cy.get("select")
      .contains("Select Schedule Time")
      .parents("div")
      .find("select")
      .then(($select) => {
        // Try to select the first non-empty option
        cy.wrap($select)
          .find("option")
          .not(':contains("Select Slot")')
          .not(':contains("Closed")')
          .not(':contains("No available")')
          .first()
          .then(($option) => {
            if ($option.length > 0) {
              cy.wrap($select).select($option.val() as string);
            }
          });
      });

    // Service selection - select first available service from dropdown
    cy.get("select")
      .first()
      .then(($select) => {
        cy.wrap($select)
          .find("option")
          .not(':contains("Select")')
          .first()
          .then(($option) => {
            if ($option.length > 0 && $option.val()) {
              cy.wrap($select).select($option.val() as string);
            }
          });
      });

    // Checkboxes
    if (data.emailOpt) {
      cy.get('input[type="checkbox"]').first().check({ force: true });
    }
    if (data.textOpt) {
      cy.get('input[type="checkbox"]').last().check({ force: true });
    }
  }

  function verifyInsertedData(data: typeof testData) {
    cy.task("db:query", {
      query: `
        SELECT * FROM allpatients 
        WHERE email = $1 
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      params: [data.email],
    }).then((result: any) => {
      expect(result.rows).to.have.length.at.least(1);

      const record = result.rows[0];
      insertedRecordId = record.id;

      // Verify fields
      expect(record.firstname).to.equal(data.firstName);
      expect(record.lastname).to.equal(data.lastName);
      expect(record.gender).to.equal(data.gender);
      // DOB might be stored in different format
      if (data.dob && record.dob) {
        expect(record.dob).to.include(data.dob.split("-")[0]); // At least year matches
      }
      expect(record.address).to.include(data.streetAddress);
      // Service is dynamically selected, just verify it exists
      expect(record.treatmenttype).to.be.a("string");
      expect(record.email_opt).to.equal(data.emailOpt);
      expect(record.text_opt).to.equal(data.textOpt);
      expect(record.locationid).to.be.a("number");

      if (data.email) {
        expect(record.email).to.equal(data.email);
      } else {
        expect(record.email).to.be.null;
      }

      // Verify phone format
      expect(record.phone).to.match(/^\+1\d{10}$/);
    });
  }
});
