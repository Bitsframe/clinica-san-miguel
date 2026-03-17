/**
 * Test Script for Promo Code Email
 * 
 * This script tests the promo code email functionality by making a direct API call.
 * Run this script with: node scripts/test-promo-email.js
 * 
 * Make sure your .env.local file has the correct RESEND_API_KEY configured.
 */

const testPromoEmail = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const testData = {
    email: 'your-email@example.com', // Replace with your actual email
    name: 'Test Patient',
    promoCode: 'FBKTEST123',
    discountPercentage: 15,
    language: 'en' // or 'es' for Spanish
  };

  console.log('🚀 Testing Promo Code Email...');
  console.log('📧 Test Data:', testData);
  console.log('🌐 API Endpoint:', `${baseUrl}/api/test-promo-email`);
  
  try {
    const response = await fetch(`${baseUrl}/api/test-promo-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Promo email sent successfully!');
      console.log('📋 Response:', result);
      console.log('📬 Check your email inbox for the promo code email');
    } else {
      console.log('❌ ERROR: Failed to send email');
      console.log('📋 Error Response:', result);
    }
  } catch (error) {
    console.log('💥 NETWORK ERROR:', error.message);
  }
};

// Generate a random promo code
const generatePromoCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'FBK';
  let code = prefix;
  
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
};

// If running directly (not imported)
if (require.main === module) {
  console.log('🎯 Clinica San Miguel - Promo Code Email Test');
  console.log('=' .repeat(50));
  
  // Generate a random promo code for testing
  const randomPromoCode = generatePromoCode();
  console.log('🎫 Generated Random Promo Code:', randomPromoCode);
  
  testPromoEmail();
}

module.exports = { testPromoEmail, generatePromoCode };