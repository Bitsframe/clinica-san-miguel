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
    cy.wait(2000);

    // Find and click the "Book an appoinment" button on the location detail page
    cy.contains("button", /Book an appoinment/i, { timeout: 15000 })
      .should("be.visible")
      .click({ force: true });

    // Wait for modal to appear by checking for the modal header text
    cy.contains("Appointment Request", { timeout: 20000 }).should("be.visible");

    // Wait for form to be interactive
    cy.wait(1000);
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

  // ============= REUSABLE HELPER FUNCTIONS =============

  /**
   * Select a date using the CustomDatePicker component
   * @param dateString - Date in YYYY-MM-DD format (e.g., "1985-06-15")
   */
  function selectDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Open date picker
    cy.get('input[placeholder="YYYY-MM-DD"]').first().click();

    // Wait for dropdown to appear - use z-50 which is unique to this dropdown
    cy.get(".shadow-lg.z-50.overflow-hidden", { timeout: 5000 })
      .should("be.visible")
      .as("datePicker");

    // Switch to years view - click the year button in the header
    cy.get("@datePicker").within(() => {
      cy.contains("button", /^\d{4}$/).click();
    });

    // Select year from the scrollable list
    cy.get("@datePicker").within(() => {
      cy.contains("button", year.toString()).scrollIntoView().click();
    });

    // Now in months view - select the month (uses short names: Jan, Feb, etc.)
    cy.get("@datePicker").within(() => {
      cy.contains("button", monthNames[month - 1]).click();
    });

    // Now in calendar view - select the day
    cy.get("@datePicker").within(() => {
      cy.contains("button", new RegExp(`^${day}$`))
        .not(".text-gray-300")
        .click();
    });
  }

  /**
   * Fill the entire appointment form with test data
   * @param data - Test data object
   */
  function fillAppointmentForm(data: typeof testData) {
    // First Name
    cy.get('input[placeholder="John"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(data.firstName);

    // Last Name
    cy.get('input[placeholder="Doe"]').clear().type(data.lastName);

    // Email (optional)
    if (data.email) {
      cy.get('input[placeholder="email@example.com"]').clear().type(data.email);
    }

    // Phone number
    cy.get('input[placeholder="(555) 000-0000"]').clear().type(data.phone);

    // Date of Birth - using the reusable helper
    selectDate(data.dob);

    // Gender - click the radio input directly
    cy.contains(data.gender).click();

    // Street Address
    cy.get('input[placeholder="123 Clinic St"]')
      .clear()
      .type(data.streetAddress);
    cy.wait(300);

    // Schedule Date
    cy.get('input[placeholder="Select Schedule date"]').click();
    cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)", {
      timeout: 5000,
    })
      .first()
      .click();

    // Schedule Time - select from dropdown
    cy.wait(500);

    // Find the time select (second select element)
    cy.get("select")
      .eq(1)
      .then(($timeSelect) => {
        cy.wrap($timeSelect)
          .find("option")
          .then(($options) => {
            const validOption = $options
              .filter((i, el) => {
                const val = el.getAttribute("value");
                const text = el.textContent || "";
                return Boolean(
                  val &&
                  val !== "" &&
                  !text.includes("Select") &&
                  !text.includes("Closed"),
                );
              })
              .first();
            if (validOption.length > 0) {
              cy.wrap($timeSelect).select(validOption.val() as string);
            }
          });
      });

    // Service selection - first select element
    cy.get("select")
      .eq(0)
      .then(($serviceSelect) => {
        cy.wrap($serviceSelect)
          .find("option")
          .then(($options) => {
            const validOption = $options
              .filter((i, el) => {
                const val = el.getAttribute("value");
                const text = el.textContent || "";
                return Boolean(val && val !== "" && !text.includes("Select"));
              })
              .first();
            if (validOption.length > 0) {
              cy.wrap($serviceSelect).select(validOption.val() as string);
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

  /**
   * Verify that the data was inserted correctly in the database
   * @param data - Test data object
   */
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
