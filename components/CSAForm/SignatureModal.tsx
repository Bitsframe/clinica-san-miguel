"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

export const SignatureModal = ({ isOpen, onClose, onSave }: SignatureModalProps) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvasRef.current) {
      const signatureData = sigCanvasRef.current.toDataURL();
      onSave(signatureData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Signature</h2>
          <p className="text-gray-600 mb-4">Draw your signature below</p>
          
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{
                className: "w-full h-64",
                style: { touchAction: 'none' }
              }}
              backgroundColor="white"
            />
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={handleClear}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
