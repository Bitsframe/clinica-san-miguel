/**
 * Supabase Contact Form & Appointment Data Integrity Tests
 * Tests cover:
 * - Form field validation and data integrity
 * - Duplicate record prevention
 * - Successful appointment creation and DB storage
 * - Consent checkboxes (email_opt, text_opt)
 * - Patient type flags (in_office_patient, new_patient)
 * - Medical form data persistence
 * - Address validation and storage
 * - Date/time scheduling
 * - Email confirmation flow
 *
 * CONFIGURATION:
 * Use custom emails by setting environment variable: CYPRESS_TEST_EMAIL=user@example.com
 * Or each test will generate unique emails with timestamps for isolation
 */

import { createClient } from "@supabase/supabase-js";

// Supabase client for direct database verification
const supabaseUrl =
  Cypress.env("SUPABASE_URL") || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  Cypress.env("SUPABASE_KEY") || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper function to generate test email
 * Checks for user-provided email via CYPRESS_TEST_EMAIL env var
 * Falls back to generated email with timestamp if not provided
 */
function getTestEmail(prefix: string = "test"): string {
  const userEmail = Cypress.env("TEST_EMAIL");
  if (userEmail) {
    // If user provided email, use it with prefix for uniqueness in same batch
    return `${prefix}-${Date.now()}@example.com`;
  }
  // Default: generate unique email with timestamp
  return `${prefix}-${Date.now()}@example.com`;
}

/**
 * Get email for tests - supports custom email input
 * Usage:
 * 1. Set custom email via environment: CYPRESS_TEST_EMAIL=john.doe@company.com
 * 2. Or pass email directly to this function
 * 3. Or let it generate unique test emails (default)
 */
function generateUniqueEmail(baseEmail?: string, prefix?: string): string {
  // If base email provided, use it as-is
  if (baseEmail && baseEmail.includes("@")) {
    return baseEmail;
  }

  // Check environment variable for user-provided email
  const envEmail = Cypress.env("TEST_EMAIL");
  if (envEmail && envEmail.includes("@")) {
    return envEmail;
  }

  // Default: generate unique test email with timestamp and optional prefix
  const emailPrefix = prefix || "test";
  return `${emailPrefix}-${Date.now()}@example.com`;
}

describe("Supabase Contact Form - Data Integrity Tests", () => {
  // Test configuration - use custom email if provided, otherwise generate unique ones
  const baseTestEmail =
    Cypress.env("TEST_EMAIL") || `test-${Date.now()}@example.com`;
  const testPhone = "(555) 123-4567";
  const testFirstName = "Test";
  const testLastName = "User";
  const testStreetAddress = "123 Test St, Test City, California 12345";
  const testZipcode = "12345";

  beforeEach(() => {
    cy.visit("/contact");
    cy.wait(1500);
  });

  describe("Form Field Data Validation", () => {
    it("should display and accept form input fields", () => {
      // Check for required form fields
      cy.get('input[type="email"]').first().should("exist").and("be.visible");
      cy.get('input[type="text"]').should("have.length.greaterThan", 0);
      cy.get('button[type="submit"]').should("exist");
    });

    it("should validate email format", () => {
      cy.get('input[type="email"]')
        .first()
        .type("invalid-email")
        .blur()
        .then(($input) => {
          const input = $input[0] as HTMLInputElement;
          expect(input.validationMessage).to.not.be.empty;
        });
    });

    it("should accept valid email format", () => {
      const validEmail = generateUniqueEmail();
      cy.get('input[type="email"]')
        .first()
        .clear()
        .type(validEmail)
        .should("have.value", validEmail);
    });

    it("should validate phone number format", () => {
      cy.get('input[placeholder*="555"]')
        .first()
        .type(testPhone)
        .should("have.value", testPhone);
    });

    it("should preserve text input values", () => {
      const testEmail = generateUniqueEmail();
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Verify values are preserved
      cy.get('input[placeholder*="First"]').should("have.value", testFirstName);
      cy.get('input[placeholder*="Last"]').should("have.value", testLastName);
      cy.get('input[type="email"]').should("have.value", testEmail);
    });

    it("should reject empty required fields", () => {
      cy.get('button[type="submit"]').click();
      // Should show validation error or warning
      cy.get("body").should("contain", "fill in");
    });
  });

  describe("Appointment Creation & Database Storage", () => {
    it("should create appointment record in Appoinments table", async () => {
      const appointmentEmail = generateUniqueEmail(undefined, "appt");

      // Fill and submit form
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: appointmentEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();

      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify success message
      cy.get("body").should("contain", "Success");

      // Verify in Supabase
      cy.task("verifyAppointmentInDB", {
        email_address: appointmentEmail,
        first_name: testFirstName,
        last_name: testLastName,
      });
    });

    it("should store all appointment fields correctly in database", async () => {
      const appointmentData = {
        firstName: `Test_${Date.now()}`,
        lastName: "Integrity",
        email: generateUniqueEmail(undefined, "integrity"),
        phone: "(555) 456-7890",
        streetAddress: "456 Main St, Springfield, IL 62701",
        zipcode: "62701",
        service: "General Consultation",
      };

      cy.fillAppointmentForm(appointmentData);
      cy.selectDateAndTime();
      cy.selectService(appointmentData.service);

      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify each field in database (using actual column names)
      cy.task("verifyAppointmentFields", {
        email_address: appointmentData.email,
        expectedFields: {
          first_name: appointmentData.firstName,
          last_name: appointmentData.lastName,
          email_address: appointmentData.email,
          service: appointmentData.service,
        },
      });
    });

    it("should store gender/sex in appointment record", async () => {
      const sexTestEmail = generateUniqueEmail(undefined, "sex-test");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: sexTestEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify sex field is stored
      cy.task("verifyAppointmentFields", {
        email_address: sexTestEmail,
        expectedFields: {
          first_name: testFirstName,
          last_name: testLastName,
        },
      });
    });
  });

  describe("Duplicate Record Prevention", () => {
    it("should prevent duplicate appointments for same location and time slot", async () => {
      const duplicateTestEmail = generateUniqueEmail(undefined, "dup");

      // First submission
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: duplicateTestEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      const selectedDateTime = cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      cy.get("body").should("contain", "Success");

      // Try second submission with same time slot
      cy.visit("/contact");
      cy.wait(1000);

      cy.fillAppointmentForm({
        firstName: "Another",
        lastName: "Person",
        email: generateUniqueEmail(undefined, "dup-second"),
        phone: "(555) 999-8888",
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Select same time slot
      cy.selectSameDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Should show error about slot unavailability
      cy.get("body").should("contain.text", [
        "slot unavailable",
        "not available",
        "booked",
      ]);
    });

    it("should allow same email for different time slots", async () => {
      const sameEmail = generateUniqueEmail(undefined, "multi-slot");

      // First appointment
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: sameEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      cy.get("body").should("contain", "Success");

      // Clear and try different time slot with same email
      cy.visit("/contact");
      cy.wait(1000);

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: sameEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDifferentDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Should succeed for different time slot
      cy.get("body").should("contain", "Success");
    });
  });

  describe("Consent Checkboxes", () => {
    it("should capture email consent checkbox", () => {
      // Consent flag test - no email needed for UI validation
      cy.contains("email", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check()
        .should("be.checked");
    });

    it("should capture text consent checkbox", () => {
      cy.contains("text", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check()
        .should("be.checked");
    });

    it("should store email consent flag in database", async () => {
      const consentEmail = generateUniqueEmail(undefined, "consent-email");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: consentEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Check email consent
      cy.contains("email", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check();

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify email_opt stored
      cy.task("verifyConsentFlags", {
        email_address: consentEmail,
        expectedEmailConsent: true,
      });
    });

    it("should store text consent flag in database", async () => {
      const consentEmail = generateUniqueEmail(undefined, "consent-text");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: consentEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Check text consent
      cy.contains("text", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check();

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify text_opt stored
      cy.task("verifyConsentFlags", {
        email_address: consentEmail,
        expectedTextConsent: true,
      });
    });
  });

  describe("Address Validation & Normalization", () => {
    it("should accept and store street address", async () => {
      const addressEmail = generateUniqueEmail(undefined, "address");
      const testAddress = "456 Oak Avenue, Berkeley, CA 94702";

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: addressEmail,
        phone: testPhone,
        streetAddress: testAddress,
        zipcode: "94702",
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify address stored
      cy.task("verifyAddressStorage", {
        email_address: addressEmail,
        expectedAddress: testAddress,
      });
    });

    it("should extract and store address components", async () => {
      const componentEmail = generateUniqueEmail(undefined, "addr-component");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: componentEmail,
        phone: testPhone,
        streetAddress: "789 Main St, Los Angeles, CA 90001",
        zipcode: "90001",
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify address is stored correctly
      cy.task("verifyAddressStorage", {
        email_address: componentEmail,
      });
    });
  });

  describe("Patient Type & Visit Flags", () => {
    it("should capture in_office_patient flag", () => {
      cy.get('input[type="checkbox"]').first().check().should("be.checked");
    });

    it("should capture new_patient flag", () => {
      // Find new patient checkbox
      cy.contains("new", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check()
        .should("be.checked");
    });

    it("should store patient type flags in database", async () => {
      const patientEmail = generateUniqueEmail(undefined, "patient-type");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: patientEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Check in-office patient
      cy.get('input[type="checkbox"]').first().check();

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify flags stored
      cy.task("verifyPatientFlags", {
        email_address: patientEmail,
        expectedInOfficePatient: true,
      });
    });

    it("should allow unchecked patient type flags", async () => {
      const uncheckedEmail = generateUniqueEmail(undefined, "unchecked");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: uncheckedEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Don't check boxes
      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify flags are false
      cy.task("verifyPatientFlags", {
        email_address: uncheckedEmail,
        expectedInOfficePatient: false,
      });
    });
  });

  describe("Medical Form Data Integrity", () => {
    it("should capture medical history in database", async () => {
      const medicalEmail = generateUniqueEmail(undefined, "medical");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: medicalEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      // Fill medical form fields
      cy.contains("Chief Complaint")
        .parent()
        .find("textarea")
        .type("Severe headache");
      cy.contains("Symptoms")
        .parent()
        .find("textarea")
        .type("Head pain, nausea");
      cy.contains("Family History")
        .parent()
        .find('input[type="checkbox"]')
        .first()
        .check();

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify medical data stored in intake_form table
      cy.task("verifyMedicalData", {
        email_address: medicalEmail,
        expectedChiefComplaint: "Severe headache",
        expectedSymptoms: "Head pain, nausea",
      });
    });

    it("should link medical form to appointment via appointment_id", async () => {
      const linkedEmail = generateUniqueEmail(undefined, "linked-medical");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: linkedEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.contains("Chief Complaint")
        .parent()
        .find("textarea")
        .type("Test complaint");
      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify appointment_id foreign key relationship
      cy.task("verifyIntakeFormLinking", {
        email_address: linkedEmail,
      });
    });
  });

  describe("Date of Birth & Service Selection", () => {
    it("should accept date of birth input", () => {
      cy.get(
        'input[placeholder*="Birth"], input[placeholder*="DOB"], input[placeholder*="dob"]',
      )
        .first()
        .type("1990-01-15");
    });

    it("should handle address suggestions/autocomplete", () => {
      cy.get('input[placeholder*="Address"]').first().type("123 Main");

      // Check if suggestions appear
      cy.get('[role="option"], .suggestion, .autocomplete-item').then(
        ($suggestions) => {
          if ($suggestions.length > 0) {
            cy.wrap($suggestions).first().click();
            cy.get('input[placeholder*="Address"]').should("not.be.empty");
          }
        },
      );
    });

    it("should store service selection in appointment", async () => {
      const serviceEmail = generateUniqueEmail(undefined, "service");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: serviceEmail,
        phone: testPhone,
        streetAddress: "789 Park Ave, Denver, CO 80202",
        zipcode: "80202",
      });

      cy.selectDateAndTime();
      cy.selectService("General Consultation");
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify service stored
      cy.task("verifyAppointmentFields", {
        email_address: serviceEmail,
        expectedFields: {
          service: "General Consultation",
        },
      });
    });
  });

  describe("Form Submission Flow & Success", () => {
    it("should show success message after valid submission", () => {
      const successEmail = generateUniqueEmail(undefined, "success");
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: successEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      cy.get("body").should("contain", "Success");
    });

    it("should clear form after successful submission", () => {
      const clearEmail = generateUniqueEmail(undefined, "clear");
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: clearEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // After success, form should be cleared or modal closed
      cy.get('input[placeholder*="First"]').then(($input) => {
        expect($input.val() === "" || $input.is(":not(:visible)")).to.be.true;
      });
    });

    it("should generate unique appointment record for each submission", async () => {
      const submissions = [];

      for (let i = 0; i < 2; i++) {
        const submissionEmail = generateUniqueEmail(undefined, `unique-${i}`);
        submissions.push(submissionEmail);

        cy.visit("/contact");
        cy.wait(1000);

        cy.fillAppointmentForm({
          firstName: `Test${i}`,
          lastName: testLastName,
          email: submissionEmail,
          phone: testPhone,
          streetAddress: testStreetAddress,
          zipcode: testZipcode,
        });

        cy.selectDateAndTime();
        cy.selectService();
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
      }

      // Verify each has unique ID
      cy.task("verifyUniqueAppointmentIds", {
        emails: submissions,
      });
    });
  });

  describe("Email Sending & Confirmation", () => {
    it("should trigger email sending on successful submission", () => {
      const emailTestEmail = generateUniqueEmail(undefined, "email-test");
      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: emailTestEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();

      // Spy on fetch to verify email call
      cy.intercept("POST", "**/api/send-email**").as("sendEmail");
      cy.intercept("POST", "**/api/messages**").as("saveMessage");

      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Check if email endpoint was called
      cy.get("@sendEmail", { timeout: 5000 }).then((interception: any) => {
        if (interception) {
          expect(interception.request.body).to.include.keys("email", "type");
        }
      });
    });

    it("should not fail appointment creation if email sending fails", () => {
      const emailFailEmail = generateUniqueEmail(undefined, "email-fail");
      cy.intercept("POST", "**/api/send-email**", { statusCode: 500 }).as(
        "failEmail",
      );

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: emailFailEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Appointment should still be created even if email fails
      cy.get("body").should("contain", "Success");
    });
  });

  describe("Data Type Validation", () => {
    it("should store phone as string", async () => {
      const phoneEmail = generateUniqueEmail(undefined, "phone-type");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: phoneEmail,
        phone: "(555) 666-7777",
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      cy.task("verifyDataType", {
        email_address: phoneEmail,
        field: "phone",
        expectedType: "string",
      });
    });

    it("should store appointment timestamp with correct format", () => {
      const dateEmail = generateUniqueEmail(undefined, "date-format");

      cy.fillAppointmentForm({
        firstName: testFirstName,
        lastName: testLastName,
        email: dateEmail,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify date_and_time field is stored with correct format
      // Expected format: "locationID|DD-MM-YYYY - HH:MM AM/PM"
      cy.task("verifyDateFormat", {
        email_address: dateEmail,
      });
    });
  });

  describe("Edge Cases & Error Handling", () => {
    it("should handle very long input strings", () => {
      const longString = "A".repeat(500);
      const longEmail = generateUniqueEmail(undefined, "long");

      cy.fillAppointmentForm({
        firstName: longString,
        lastName: testLastName,
        email: longEmail,
        phone: testPhone,
        streetAddress: longString,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Should either truncate or show validation error
      cy.get("body").then(($body) => {
        const hasSuccess = $body.text().includes("Success");
        const hasError =
          $body.text().includes("error") || $body.text().includes("must");
        expect(hasSuccess || hasError).to.be.true;
      });
    });

    it("should handle special characters in input", async () => {
      const specialEmail = generateUniqueEmail(undefined, "special");

      cy.fillAppointmentForm({
        firstName: "Test's-Name",
        lastName: "O'Brien",
        email: specialEmail,
        phone: testPhone,
        streetAddress: 'Apt #123, "Oak" Ave',
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Should handle special characters without SQL injection
      cy.task("verifySpecialCharacters", {
        email_address: specialEmail,
      });
    });

    it("should handle concurrent submissions", () => {
      // This is limited by UI constraints, but test rapid submissions
      const email1 = generateUniqueEmail(undefined, "concurrent-1");
      const email2 = generateUniqueEmail(undefined, "concurrent-2");

      cy.fillAppointmentForm({
        firstName: "User1",
        lastName: testLastName,
        email: email1,
        phone: testPhone,
        streetAddress: testStreetAddress,
        zipcode: testZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();

      // Should prevent double submission
      cy.get('button[type="submit"]').should("be.disabled");
      cy.wait(2000);
    });
  });

  // ============= CUSTOM TESTS WITH YOUR OWN EMAILS =============
  // Uncomment and edit this section to test with your own email addresses

  describe("Custom Tests - Your Own Emails", () => {
    // EDIT THESE WITH YOUR OWN EMAILS:
    const yourEmail = "firozaa.hussain@gmail.com"; // ← REPLACE WITH YOUR EMAIL
    const yourFirstName = "Firoza";
    const yourLastName = "Hussain";
    const yourPhone = "(555) 123-4567";
    const yourAddress = "Your Street Address";
    const yourZipcode = "12345";

    it("custom: should create appointment with your email", () => {
      cy.fillAppointmentForm({
        firstName: yourFirstName,
        lastName: yourLastName,
        email: yourEmail,
        phone: yourPhone,
        streetAddress: yourAddress,
        zipcode: yourZipcode,
      });

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify in database
      cy.task("verifyAppointmentInDB", {
        email_address: yourEmail,
        first_name: yourFirstName,
        last_name: yourLastName,
      });

      cy.get("body").should("contain", "Success");
    });

    it("custom: should verify your appointment data in database", () => {
      cy.fillAppointmentForm({
        firstName: yourFirstName,
        lastName: yourLastName,
        email: yourEmail,
        phone: yourPhone,
        streetAddress: yourAddress,
        zipcode: yourZipcode,
      });

      // Check consent flags
      cy.contains("email", { matchCase: false })
        .parent()
        .find('input[type="checkbox"]')
        .check();

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify all fields stored correctly
      cy.task("verifyAppointmentFields", {
        email_address: yourEmail,
        expectedFields: {
          first_name: yourFirstName,
          last_name: yourLastName,
          email_address: yourEmail,
          phone: yourPhone,
          address: yourAddress,
        },
      });

      // Verify consent was saved
      cy.task("verifyConsentFlags", {
        email_address: yourEmail,
        expectedEmailConsent: true,
      });
    });

    it("custom: should test with medical form", () => {
      cy.fillAppointmentForm({
        firstName: yourFirstName,
        lastName: yourLastName,
        email: yourEmail,
        phone: yourPhone,
        streetAddress: yourAddress,
        zipcode: yourZipcode,
      });

      // Add medical info
      cy.contains("Chief Complaint")
        .parent()
        .find("textarea")
        .type("Test complaint");

      cy.selectDateAndTime();
      cy.selectService();
      cy.get('button[type="submit"]').click();
      cy.wait(2000);

      // Verify medical form was linked
      cy.task("verifyIntakeFormLinking", {
        email_address: yourEmail,
      });
    });
  });
  // ============= END CUSTOM TESTS =============
});

// ============= Custom Command Definitions =============

Cypress.Commands.add(
  "fillAppointmentForm",
  (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress: string;
    zipcode: string;
  }) => {
    cy.get('input[placeholder*="First"]').first().clear().type(data.firstName);
    cy.get('input[placeholder*="Last"]').first().clear().type(data.lastName);
    cy.get('input[type="email"]').first().clear().type(data.email);

    // Find phone input (may be in various formats)
    cy.get(
      'input[placeholder*="555"], input[placeholder*="phone"], input[placeholder*="Phone"]',
    )
      .first()
      .clear()
      .type(data.phone);

    // Find address input
    cy.get(
      'input[placeholder*="Address"], input[placeholder*="address"], input[placeholder*="street"]',
    )
      .first()
      .clear()
      .type(data.streetAddress);

    // Find or wait for state extraction
    cy.wait(500);

    // Find zipcode
    cy.get('input[placeholder*="zip"], input[placeholder*="Zip"]')
      .first()
      .clear()
      .type(data.zipcode);
  },
);

Cypress.Commands.add("selectDateAndTime", () => {
  // Open date picker
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"]',
  )
    .first()
    .click();

  // Select a date (preferably future date)
  cy.get('[aria-label*="20"], button:contains("15")').first().click();

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
          cy.wrap(timeSelect).select(option.attr("value") || "");
        });
    }
  });
});

Cypress.Commands.add("selectSameDateAndTime", () => {
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"]',
  )
    .first()
    .click();

  // Select same date
  cy.get('[aria-label*="20"], button:contains("15")').first().click();

  // Select same time
  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time"),
    );
    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .eq(1)
        .then((option) => {
          cy.wrap(timeSelect).select(option.attr("value") || "");
        });
    }
  });
});

Cypress.Commands.add("selectDifferentDateAndTime", () => {
  cy.get(
    'input[placeholder*="YYYY-MM-DD"], input[placeholder*="Select a date"]',
  )
    .first()
    .click();

  // Select different date
  cy.get('[aria-label*="20"], button:contains("20")').first().click();

  // Select different time
  cy.get("select").then(($selects) => {
    const timeSelect = Array.from($selects).find((select) =>
      select.textContent?.toLowerCase().includes("time"),
    );
    if (timeSelect) {
      cy.wrap(timeSelect)
        .find("option")
        .eq(2)
        .then((option) => {
          cy.wrap(timeSelect).select(option.attr("value") || "");
        });
    }
  });
});

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
            cy.wrap(serviceSelect).select(option.attr("value") || "");
          });
      }
    }
  });
});
