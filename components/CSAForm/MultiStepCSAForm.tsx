import React, { useState } from 'react';
import Self_Appointment from './index';

// This is a wrapper to show the CSA form in a multi-step modal
const MultiStepCSAForm = ({ location, onClose }: { location: any, onClose?: () => void }) => {
  const [page, setPage] = useState(0);

  // You can split the form fields into pages as needed
  // For demo, page 0 = demographics, page 1 = medical, page 2 = review/submit
  // We'll use the same Self_Appointment form but only show one section at a time

  // You can pass props to Self_Appointment to control which section is visible
  // For now, just show the whole form and add Next/Back buttons

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl">&times;</button>
        )}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#C1001F]">Appointment Request</h2>
          <div className="flex gap-2">
            <span className={`w-3 h-3 rounded-full ${page === 0 ? 'bg-[#C1001F]' : 'bg-gray-300'}`}></span>
            <span className={`w-3 h-3 rounded-full ${page === 1 ? 'bg-[#C1001F]' : 'bg-gray-300'}`}></span>
            <span className={`w-3 h-3 rounded-full ${page === 2 ? 'bg-[#C1001F]' : 'bg-gray-300'}`}></span>
          </div>
        </div>
        <div className="min-h-[400px]">
          {/* Render the CSA form, but you can control which fields to show based on page */}
          <Self_Appointment location={location} page={page} />
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Back
          </button>
          {page < 2 ? (
            <button
              className="px-4 py-2 rounded bg-[#C1001F] text-white"
              onClick={() => setPage((p) => Math.min(2, p + 1))}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MultiStepCSAForm;
