'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const TestPromoEmailPage = () => {
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    name: 'John Doe',
    promoCode: 'FBKTEST123',
    discountPercentage: 15,
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' ? parseInt(value) || 0 : value
    }));
  };

  const generateRandomPromoCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'FBK';
    let code = prefix;
    
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setFormData(prev => ({ ...prev, promoCode: code }));
  };

  const sendTestEmail = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('/api/test-promo-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setResponse(result);

      if (response.ok) {
        toast.success('Promo code email sent successfully!');
      } else {
        toast.error(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error occurred');
      setResponse({ error: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Test Promo Code Email</h1>
          <p className="text-gray-600 mt-2">Send a test promo code email to verify the functionality</p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter email address"
            />
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter patient name"
            />
          </div>

          {/* Promo Code Input */}
          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter promo code"
              />
              <button
                type="button"
                onClick={generateRandomPromoCode}
                className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter discount percentage"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Email Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Send Button */}
          <button
            onClick={sendTestEmail}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>

        {/* Response Display */}
        {response && (
          <div className="mt-6 p-4 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Response:</h3>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>1. Enter a valid email address (your own for testing)</li>
            <li>2. Customize the patient name and promo code</li>
            <li>3. Set the discount percentage (1-100%)</li>
            <li>4. Choose email language (English or Spanish)</li>
            <li>5. Click "Send Test Email" to trigger the promo email</li>
            <li>6. Check your email inbox for the promo code email</li>
          </ul>
        </div>

        {/* Current Configuration */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Email Configuration:</h3>
          <div className="text-xs text-yellow-800 space-y-1">
            <div><strong>From:</strong> Feedback@alerts.myclinicmd.com</div>
            <div><strong>Subject:</strong> {formData.language === 'en' 
              ? 'Thank You for Your Feedback - Enjoy Discount on Your Next Visit!' 
              : 'Gracias por su Comentario - ¡Disfrute de Descuento en su Próxima Visita!'
            }</div>
            <div><strong>Template:</strong> FEEDBACK_SUBMISSION_SUCCESS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPromoEmailPage;