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
    service: "Dot Test", // Make sure this service exists in your DB
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

    cy.contains("button", /Book an appoinment/i, { timeout: 10000 }).should(
      "be.visible",
    );

    // Click the Book an Appointment button to open modal
    cy.contains("button", /Book an appoinment/i).click({ force: true });

    // Wait for modal to open - Flowbite Modal renders with specific classes
    // The modal title contains "Appointment Request" but check for form elements too
    cy.get('input[placeholder="John"]', { timeout: 20000 }).should(
      "be.visible",
    );
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
    cy.get('button:contains("Book now"), button[type="submit"]').click();

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
    cy.get('button:contains("Book now")').click();

    // Check for validation message
    cy.contains("Please fill in the following fields", {
      timeout: 5000,
    }).should("be.visible");
  });

  it("TC-003: Should handle optional email field", () => {
    setupAppointmentModal();

    // Fill form without email
    fillAppointmentForm({ ...testData, email: "" });

    cy.get('button:contains("Book now")').click();
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
    cy.get('button:contains("Book now")').click();
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
      cy.get('button:contains("Book now")').click();
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
    cy.get('button:contains("Book now")').click();
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
    cy.get('button:contains("Book now")').click();
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
    // Personal Information
    cy.get('input[placeholder*="First Name"], input[placeholder*="John"]').type(
      data.firstName,
    );
    cy.get('input[placeholder*="Last Name"], input[placeholder*="Doe"]').type(
      data.lastName,
    );

    if (data.email) {
      cy.get(
        'input[type="email"], input[placeholder*="email@example.com"]',
      ).type(data.email);
    }

    // Phone - type without +1
    cy.get('input[type="tel"], input[placeholder*="(555)"]').type(data.phone);

    // Date of Birth
    cy.get('input[placeholder*="YYYY-MM-DD"]').first().type(data.dob);

    // Gender selection
    cy.contains("label", data.gender).click();

    // Street Address
    cy.get(
      'input[placeholder*="Street Address"], input[placeholder*="123 Clinic St"]',
    ).type(data.streetAddress);

    // Wait for and select address suggestion if it appears
    cy.get("body").then(($body) => {
      if (
        $body.find('ul[class*="suggestions"], .address-suggestions').length > 0
      ) {
        cy.get('ul[class*="suggestions"] li, .address-suggestions li')
          .first()
          .click();
      }
    });

    // Date selection
    cy.get(".react-datepicker__input-container input").click();
    cy.get(".react-datepicker__day--today, .react-datepicker__day--available")
      .first()
      .click();

    // Time selection (first available)
    cy.get("select").last().should("not.be.disabled");
    cy.get("select")
      .last()
      .find("option")
      .not(":first-child")
      .first()
      .invoke("val")
      .then((value) => {
        cy.get("select")
          .last()
          .select(value as string);
      });

    // Service selection
    cy.get("select").first().select(data.service);

    // Checkboxes
    if (data.emailOpt) {
      cy.get('input[type="checkbox"]').first().check();
    }
    if (data.textOpt) {
      cy.get('input[type="checkbox"]').last().check();
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
      expect(result.rows).to.have.length(1);

      const record = result.rows[0];
      insertedRecordId = record.id;

      // Verify fields
      expect(record.firstname).to.equal(data.firstName);
      expect(record.lastname).to.equal(data.lastName);
      expect(record.gender).to.equal(data.gender);
      expect(record.dob).to.equal(data.dob);
      expect(record.address).to.include(data.streetAddress);
      expect(record.treatmenttype).to.equal(data.service);
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
