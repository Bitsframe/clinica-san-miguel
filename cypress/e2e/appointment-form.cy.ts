// cypress/e2e/appointment-form.cy.ts

describe('Appointment Form - Backend Insertion Tests', () => {
  // Use a unique identifier to avoid test data collisions
  const uniqueId = Date.now();
  
  // Realistic test data - NOT using test email domains
  const testData = {
    // Use real email format but with +tag for uniqueness (still delivers to your inbox)
    // or use a disposable email service if needed
    email: `patient.johnson${uniqueId}@gmail.com`,
    
    // Real phone number format (won't actually be called)
    phone: '+12125551234',
    
    // Personal information
    firstName: 'John',
    lastName: 'Johnson',
    fullName: 'John Johnson',
    dob: '1985-06-15', // June 15, 1985
    gender: 'Male',
    
    // Address (real NYC address)
    streetAddress: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    fullAddress: '123 Main Street, New York, NY 10001',
    
    // Medical information
    chiefComplaint: 'Persistent lower back pain for 2 weeks',
    onsetDate: '2026-02-20', // 2 weeks ago from March 6
    location: 'Lower back, radiating to right leg',
    severity: '7',
    symptomsDescription: 'Sharp pain when standing up, numbness in right foot',
    relievingFactors: ['Rest', 'Ibuprofen'],
    medicalConditions: 'Hypertension, Type 2 Diabetes',
    surgeries: 'Appendectomy (2010)',
    allergies: 'Penicillin, Sulfa drugs',
    currentMedications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    familyHistory: {
      hypertension: true,
      diabetes: true,
      cancer: false,
      heartDisease: true,
      unknown: false
    },
    cancerType: '', // Not applicable
    tobaccoUse: false,
    alcoholUse: true,
    drugUse: false,
    occupation: 'Construction Worker'
  };

  // Store the inserted record ID for verification
  let insertedRecordId: number | null = null;

  beforeEach(() => {
    // Visit the contact page and open modal for a specific location
    cy.visit('/contact');
    
    // Wait for page to load
    cy.get('body').should('be.visible');
    
    // Click on a specific location (adjust selector based on your actual implementation)
    // This example assumes you have location cards/buttons with data attributes
    cy.get('[data-location-id="15"]').click(); // Click on first location
    
    // Wait for modal to appear
    cy.get('.modal-content, [role="dialog"]', { timeout: 10000 }).should('be.visible');
    
    // Verify modal title
    cy.contains('Request an Appointment').should('be.visible');
  });

  afterEach(() => {
    // Clean up: Delete the test record from database if it was inserted
    if (insertedRecordId) {
      cy.task('db:query', {
        query: 'DELETE FROM allpatients WHERE id = $1',
        params: [insertedRecordId]
      }).then(() => {
        console.log(`Test record ${insertedRecordId} deleted`);
      });
    }
  });

  it('TC-001: Should successfully submit complete appointment form with all fields', () => {
    // Fill out the form step by step
    fillAppointmentForm(testData);
    
    // Submit the form
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    // Wait for success message
    cy.contains('Appointment Booked Successfully', { timeout: 15000 }).should('be.visible');
    
    // Verify the data was inserted in Supabase
    verifyInsertedData(testData);
  });

  it('TC-002: Should handle optional email field when not provided', () => {
    // Create modified test data without email
    const noEmailData = { ...testData, email: '' };
    
    fillAppointmentForm(noEmailData);
    
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    cy.contains('Appointment Booked Successfully', { timeout: 15000 }).should('be.visible');
    
    // Verify email is null in database
    verifyInsertedData(noEmailData, true);
  });

  it('TC-003: Should validate required fields on submission', () => {
    // Try to submit without filling required fields
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    // Should show validation error
    cy.contains('Please fill in the following fields', { timeout: 5000 }).should('be.visible');
    
    // Fill only first name and try again
    cy.get('input[placeholder*="First Name"], input[placeholder*="John"]').type(testData.firstName);
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    // Should still show validation error
    cy.contains('Please fill in the following fields').should('be.visible');
  });

  it('TC-004: Should format phone number correctly (+1 prefix)', () => {
    // Use phone without +1 prefix
    const phoneWithoutPrefix = '2125551234';
    const formattedPhone = `+1${phoneWithoutPrefix}`;
    
    cy.get('input[placeholder*="First Name"], input[placeholder*="John"]').type(testData.firstName);
    cy.get('input[placeholder*="Last Name"], input[placeholder*="Doe"]').type(testData.lastName);
    cy.get('input[type="tel"], input[placeholder*="(555)"]').type(phoneWithoutPrefix);
    
    // Fill other required fields minimally
    fillRequiredFieldsMinimal(testData);
    
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    cy.contains('Appointment Booked Successfully', { timeout: 15000 }).should('be.visible');
    
    // Verify phone was formatted correctly
    verifyPhoneFormat(formattedPhone);
  });

  it('TC-005: Should handle family history with cancer type', () => {
    const cancerData = {
      ...testData,
      familyHistory: {
        hypertension: false,
        diabetes: false,
        cancer: true,
        heartDisease: false,
        unknown: false
      },
      cancerType: 'Breast Cancer'
    };
    
    fillAppointmentForm(cancerData);
    
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    cy.contains('Appointment Booked Successfully', { timeout: 15000 }).should('be.visible');
    
    // Verify cancer data
    verifyCancerData(cancerData);
  });

  it('TC-006: Should handle family history "unknown" option', () => {
    const unknownData = {
      ...testData,
      familyHistory: {
        hypertension: false,
        diabetes: false,
        cancer: false,
        heartDisease: false,
        unknown: true
      },
      cancerType: '' // Should be cleared automatically
    };
    
    fillAppointmentForm(unknownData);
    
    cy.get('button[type="submit"], button:contains("Submit")').click();
    
    cy.contains('Appointment Booked Successfully', { timeout: 15000 }).should('be.visible');
    
    // Verify unknown flag is true and all others false
    verifyUnknownFamilyHistory();
  });

  // Helper functions
  function fillAppointmentForm(data: typeof testData) {
    // Personal Information
    cy.get('input[placeholder*="First Name"], input[placeholder*="John"]').type(data.firstName);
    cy.get('input[placeholder*="Last Name"], input[placeholder*="Doe"]').type(data.lastName);
    
    if (data.email) {
      cy.get('input[type="email"], input[placeholder*="email"]').type(data.email);
    }
    
    cy.get('input[type="tel"], input[placeholder*="(555)"]').type(data.phone.replace('+1', ''));
    
    // Date of Birth
    cy.get('input[placeholder*="YYYY-MM-DD"]').first().type(data.dob);
    
    // Gender selection
    cy.contains('label', data.gender).click();
    
    // Address
    cy.get('input[placeholder*="Street Address"], input[placeholder*="123 Clinic St"]').type(data.streetAddress);
    
    // Wait for address suggestions and select (if using SmartyStreets)
    cy.get('ul[class*="suggestions"], .address-suggestions', { timeout: 5000 }).should('be.visible');
    cy.get('ul[class*="suggestions"] li, .address-suggestions li').first().click();
    
    // Service selection
    cy.get('select').contains('Select Service').parent().select(1); // Select first non-empty option
    
    // Date and Time selection
    cy.get('.react-datepicker__input-container input').click();
    cy.get('.react-datepicker__day--today, .react-datepicker__day--available').first().click();
    
    // Select time slot (first available)
    cy.get('select').last().should('not.be.disabled');
    cy.get('select').last().find('option').not(':first-child').first().invoke('val').then((value) => {
      cy.get('select').last().select(value as string);
    });
    
    // Opt-in checkboxes
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input[type="checkbox"]').last().check();
  }

  function fillRequiredFieldsMinimal(data: typeof testData) {
    // Fill only what's necessary for submission
    cy.get('input[placeholder*="Last Name"], input[placeholder*="Doe"]').type(data.lastName);
    cy.get('input[type="tel"], input[placeholder*="(555)"]').type(data.phone.replace('+1', ''));
    cy.get('input[placeholder*="YYYY-MM-DD"]').first().type(data.dob);
    cy.contains('label', data.gender).click();
    cy.get('input[placeholder*="Street Address"], input[placeholder*="123 Clinic St"]').type(data.streetAddress);
    cy.get('ul[class*="suggestions"] li').first().click();
    cy.get('select').contains('Select Service').parent().select(1);
    cy.get('.react-datepicker__input-container input').click();
    cy.get('.react-datepicker__day--today').first().click();
    cy.get('select').last().find('option').not(':first-child').first().invoke('val').then((value) => {
      cy.get('select').last().select(value as string);
    });
  }

  function verifyInsertedData(data: typeof testData, skipEmail = false) {
    // Query the database to verify insertion
    cy.task('db:query', {
      query: `
        SELECT * FROM allpatients 
        WHERE firstname = $1 
        AND lastname = $2 
        AND phone = $3 
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      params: [data.firstName, data.lastName, data.phone.startsWith('+1') ? data.phone : `+1${data.phone}`]
    }).then((result: any) => {
      expect(result.rows).to.have.length(1);
      
      const record = result.rows[0];
      insertedRecordId = record.id;
      
      // Verify all fields
      expect(record.firstname).to.equal(data.firstName);
      expect(record.lastname).to.equal(data.lastName);
      expect(record.gender).to.equal(data.gender);
      expect(record.dob).to.equal(data.dob);
      expect(record.address).to.include(data.streetAddress);
      
      if (!skipEmail) {
        expect(record.email).to.equal(data.email);
      } else {
        expect(record.email).to.be.null;
      }
      
      // Verify opt-ins
      expect(record.email_opt).to.be.true;
      expect(record.text_opt).to.be.true;
      
      // Verify formatting
      expect(record.phone).to.match(/^\+1\d{10}$/); // Should be +1 followed by 10 digits
    });
  }

  function verifyPhoneFormat(expectedPhone: string) {
    cy.task('db:query', {
      query: `
        SELECT phone FROM allpatients 
        WHERE firstname = $1 AND lastname = $2 
        ORDER BY created_at DESC LIMIT 1
      `,
      params: [testData.firstName, testData.lastName]
    }).then((result: any) => {
      expect(result.rows[0].phone).to.equal(expectedPhone);
    });
  }

  function verifyCancerData(data: any) {
    cy.task('db:query', {
      query: `
        SELECT * FROM allpatients 
        WHERE firstname = $1 AND lastname = $2 
        ORDER BY created_at DESC LIMIT 1
      `,
      params: [data.firstName, data.lastName]
    }).then((result: any) => {
      // Note: This assumes your medical form data is stored in a JSONB column
      // Adjust based on your actual schema
      expect(result.rows[0].medical_data.family_history.cancer).to.be.true;
      expect(result.rows[0].medical_data.cancer_type).to.equal(data.cancerType);
    });
  }

  function verifyUnknownFamilyHistory() {
    cy.task('db:query', {
      query: `
        SELECT * FROM allpatients 
        WHERE firstname = $1 AND lastname = $2 
        ORDER BY created_at DESC LIMIT 1
      `,
      params: [testData.firstName, testData.lastName]
    }).then((result: any) => {
      const medicalData = result.rows[0].medical_data;
      expect(medicalData.family_history.hypertension).to.be.false;
      expect(medicalData.family_history.diabetes).to.be.false;
      expect(medicalData.family_history.cancer).to.be.false;
      expect(medicalData.family_history.heart_disease).to.be.false;
      expect(medicalData.family_history.unknown).to.be.true;
      expect(medicalData.cancer_type).to.equal('');
    });
  }
});