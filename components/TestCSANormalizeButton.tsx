declare global {
  interface Window {
    __autofillCSA?: (data: any) => void;
  }
}
"use client";
import React, { useState } from 'react';


const sampleQAPairs = [
  { question: 'Reason for visit (chief complaint)', answer: 'I’ve been having lower back pain.' },
  { question: 'How long have you been experiencing this issue?', answer: 'About three weeks.' },
  { question: 'Where are the symptoms located?', answer: 'My lower back, mostly on the left side.' },
  { question: 'On a scale of 1 to 10, how severe are your symptoms?', answer: '7' },
  { question: 'Can you describe your symptoms in more detail?', answer: 'It’s a sharp pain when I bend and a dull ache when sitting.' },
  { question: 'What makes your symptoms better or helps relieve them?', answer: 'Resting and using heat helps.' },
  { question: 'Do you have any existing medical conditions?', answer: 'I have high blood pressure.' },
  { question: 'Are you currently taking any medications?', answer: 'Yes, I take Lisinopril.' },
  { question: 'Have you had any past surgeries?', answer: 'No, I have not had any surgeries.' },
  { question: 'Do you have any allergies?', answer: 'No, I do not have any allergies.' },
  { question: 'Is there any family history of medical conditions?', answer: 'My father has diabetes.' },
  { question: 'Do you use tobacco?', answer: 'No.' },
  { question: 'Do you drink alcohol?', answer: 'Yes, socially.' },
  { question: 'Do you use any recreational drugs?', answer: 'No.' },
  { question: 'What is your occupation?', answer: 'I work as an office administrator.' },
];


// export default function TestCSANormalizeButton() {
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const handleTest = async () => {
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     console.log('Sending sampleQAPairs to /api/normalize-csa:', sampleQAPairs);
//     try {
//       const response = await fetch('/api/normalize-csa', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ qaPairs: sampleQAPairs })
//       });
//       const data = await response.json();
//       if (data && data.normalized) {
//         // Try window.__autofillCSA if available (for direct form fill)
//         if (typeof window !== 'undefined' && typeof (window as any).__autofillCSA === 'function') {
//           (window as any).__autofillCSA(data.normalized);
//         }
//       }
//       setResult(data);
//     } catch (err) {
//       let message = 'Unknown error';
//       if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
//         message = (err as any).message;
//       }
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
//       <h2>Test CSA Normalize API (Button)</h2>
//       <button
//         onClick={handleTest}
//         disabled={loading}
//         style={{
//           marginBottom: 16,
//           background: '#C1001F',
//           color: '#fff',
//           border: 'none',
//           borderRadius: 6,
//           padding: '12px 24px',
//           fontWeight: 600,
//           fontSize: 16,
//           cursor: loading ? 'not-allowed' : 'pointer',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
//         }}
//       >
//         {loading ? 'Testing...' : 'Send Sample Q&A to Normalize API'}
//       </button>
//       {error && <div style={{ color: 'red', marginTop: 12 }}>Error: {error}</div>}
//       {result && (
//         <pre style={{ marginTop: 16, background: '#f8f8f8', padding: 12, borderRadius: 4 }}>
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }
