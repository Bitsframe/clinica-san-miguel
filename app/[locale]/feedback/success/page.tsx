'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

const ThankYouPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [promoCode, setPromoCode] = useState('');
  const [name, setName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    const nameFromUrl = searchParams.get('name');
    const percentFromUrl = searchParams.get('percent');

    setPromoCode(codeFromUrl || '[Promo Code]');
    setName(nameFromUrl || 'Valued Patient');
    setDiscountPercentage(percentFromUrl ? parseInt(percentFromUrl, 10) : 10);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <Image
          src="/assets/discount-icon.png"
          alt="MyClinic Logo"
          width={80}
          height={80}
          className="w-20"
        />
      </div>

      {/* Main Content */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Thank You for Your Feedback – Enjoy {discountPercentage}% Off on Your Next Visit!
      </h1>

      <p className="text-lg text-gray-700 mb-4">
        Dear <span className="font-semibold">{name}</span>,
      </p>

      <p className="text-gray-700 mb-4 max-w-xl">
        We sincerely appreciate you taking the time to share your feedback with us. Your input helps us improve and deliver the best possible care at Clínica San Miguel.
      </p>

      <p className="text-gray-700 mb-4 max-w-xl">
        As a token of our gratitude, we are pleased to offer you <span className="font-bold">{discountPercentage}% off</span> on your next visit! Simply use the promo code <span className="font-bold">{promoCode}</span> when you schedule your appointment or make your next purchase.
      </p>

      <p className="text-gray-700 mb-4 max-w-xl">
        We look forward to welcoming you back soon!
      </p>

      <p className="text-gray-700 mb-6 max-w-xl">
        Warm regards,<br />
        Team,<br />
        Clínica San Miguel
      </p>

      {/* Footer */}
      <div className="mt-8 text-gray-600">
        Managed by MyClinicMD
      </div>
    </div>
  );
};

export default ThankYouPage;
