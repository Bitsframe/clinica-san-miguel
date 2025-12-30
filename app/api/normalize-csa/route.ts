export const runtime = "nodejs";

import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {

  try {
    console.log('[CSA-NORMALIZE] Incoming request');
    const body = await req.json();
    let { qaPairs } = body;
    if (!qaPairs || !Array.isArray(qaPairs)) {
      console.error('[CSA-NORMALIZE] Missing or invalid qaPairs:', qaPairs);
      return new Response(JSON.stringify({ error: 'Missing or invalid qaPairs' }), { status: 400 });
    }
    // Remove duplicate Q&A pairs
    const uniqueQAPairs = [];
    const seen = new Set();
    for (const pair of qaPairs) {
      const key = pair.question + '|' + pair.answer;
      if (!seen.has(key)) {
        uniqueQAPairs.push(pair);
        seen.add(key);
      }
    }
    // HARD CAP: Limit to last 20 unique pairs, always
    const limitedQAPairs = uniqueQAPairs.slice(-20);
    // Inject current date as a Q&A pair at the start
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDate = `${yyyy}-${mm}-${dd}`;
    qaPairs = [
      { question: "What is today's date?", answer: currentDate },
      ...limitedQAPairs
    ];
    // Log the final Q&A count and sample
    console.log(`[CSA-NORMALIZE] Final Q&A count (HARD CAP 20): ${qaPairs.length}`);
    console.log('[CSA-NORMALIZE] Final Q&A sample:', qaPairs);

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    console.log('[CSA-NORMALIZE] OPENAI_API_KEY:', OPENAI_API_KEY ? OPENAI_API_KEY.slice(0, 8) + '...' : 'NOT SET');
    if (!OPENAI_API_KEY) {
      const envKeys = Object.keys(process.env || {});
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured',
        envKeys,
        envSample: envKeys.slice(0, 10).map(k => [k, process.env[k]]),
        openaiKeyValue: process.env.OPENAI_API_KEY || null
      }), { status: 500 });
    }


    // Cancer types allowed in the dropdown
    const validCancerTypes = [
      "Carcinoma",
      "Sarcoma",
      "Leukemia",
      "Lymphoma",
      "Myeloma",
      "Melanoma",
      "CNS tumors"
    ];


    const relievingFactorOptions = [
      "Rest",
      "Ice",
      "Heat",
      "Elevation",
      "Medication",
      "Stretching",
      "Massage",
      "Support or compression",
      "Time",
      "Other"
    ];

    const prompt = `You are a medical intake assistant. Given the following Q&A pairs from a patient intake conversation, extract and return a JSON object with these fields, grouped and ordered for direct use in a React form:

  // Demographics & Schedule
  - service (string)
  - first_name (string)
  - last_name (string)
  - phone (string)
  - sex (string, one of: "Male", "Female", "Other")
  - dob (string, ISO format YYYY-MM-DD)
  - schedule_date (string, ISO format YYYY-MM-DD)
  - schedule_time (string, e.g., "10:00 AM")

  // Medical Information
  - chief_complaint (string)
  - onset_date (string, ISO format YYYY-MM-DD, if user provides a duration or date, otherwise null)
  - location (string)
  - severity (number, 1-10, as a number not a word)
  - symptoms_description (array of strings)
  - relieving_factors (object: { options: array of strings from [${relievingFactorOptions.join(", ")}], other: string | null })
  - medical_conditions (array of strings)
  - surgeries_choice (string, "Yes" or "No")
  - surgeries (string, only if surgeries_choice is "Yes", otherwise empty string)
  - allergies_choice (string, "Yes" if user mentions any allergies, otherwise "No")
  - allergies (array of strings, only if allergies_choice is "Yes", otherwise empty array)
  - current_medications (string)
  - family_history (object: hypertension, diabetes, cancer, heart_disease, unknown as booleans)
  - tobacco_use (boolean)
  - alcohol_use (boolean)
  - drug_use (boolean)
  - occupation (string)
  - cancer_type (string or null; if family_history.cancer is true and user provides a cancer type, match it to the closest valid option from this list: ${validCancerTypes.join(", ")}. If no close match, return null.)

  // Preventive/Reproductive History (if applicable)
  - num_pregnancies (string or number)
  - birth_control (string)
  - pap_smear (string)
  - pap_smear_date (string, YYYY-MM or empty)
  - mammogram (string)
  - mammogram_date (string, YYYY-MM or empty)
  - prostate_exam (string)
  - prostate_exam_date (string, YYYY-MM or empty)

  For relieving_factors:
    - Map the user's described relieving factors to the closest options from this list: [${relievingFactorOptions.join(", ")}].
    - If the user mentions a relieving factor not in the list, include "Other" in the options array and set the 'other' field to the user's provided value (for autofill in a textbox).
    - If the user only mentions options from the list, set 'other' to null.

  For surgeries:
    - If the user says "Yes" to surgeries_choice, set the surgeries field to the user's provided surgery value (for autofill in the textbox that appears when "Yes" is selected).
    - If the user says "No" or does not mention any surgeries, set surgeries to an empty string.

  For allergies:
    - If the user mentions any allergies, set allergies_choice to "Yes", open the textbox, and autofill it with the user's provided allergy values (as an array of strings).
    - If the user does not mention any allergies, set allergies_choice to "No" and allergies to an empty array.

  If the user mentions a duration for symptoms (e.g., "past 4 days", "for 2 weeks", "since last Monday"), calculate the onset_date as today's date minus the specified duration, and return it as an ISO date string (YYYY-MM-DD). If a specific date is mentioned, use that date. If not, set onset_date to null.

  If family_history.cancer is true and the user provides a cancer type, match it to the closest valid option from this list: ${validCancerTypes.join(", ")}. If no close match, return null.

  Return only the JSON object. Ensure all values are in the correct type and format for direct use in a React form.

  Q&A pairs:\n${qaPairs.map((q: any, i: number) => `${i+1}. Q: ${q.question}\nA: ${q.answer}`).join('\n')}\n\nReturn only the JSON object.`;

    console.log('[CSA-NORMALIZE] Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });
    const text = await response.text();
    console.log('[CSA-NORMALIZE] OpenAI raw response:', text);
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[CSA-NORMALIZE] Failed to parse OpenAI response:', text);
      return new Response(JSON.stringify({ error: 'Failed to parse OpenAI response', raw: text }), { status: 500 });
    }
    // Try to extract JSON from the response
    let normalized = null;
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      try {
        normalized = JSON.parse(data.choices[0].message.content);
      } catch (e) {
        // Try to extract JSON substring
        const match = data.choices[0].message.content.match(/\{[\s\S]*\}/);
        if (match) {
          normalized = JSON.parse(match[0]);
        }
      }
    }
    // Post-process: if family_history.cancer is true, map cancer_type to closest valid option
    if (normalized && normalized.family_history && normalized.family_history.cancer && normalized.cancer_type) {
      const cancerType = normalized.cancer_type.toLowerCase();
      // Exact match
      let match = validCancerTypes.find(type => type.toLowerCase() === cancerType);
      // Partial match
      if (!match) {
        match = validCancerTypes.find(type => cancerType.includes(type.toLowerCase()) || type.toLowerCase().includes(cancerType));
      }
      // Fuzzy match (start)
      if (!match) {
        match = validCancerTypes.find(type => type.toLowerCase().startsWith(cancerType.slice(0,3)));
      }
      normalized.cancer_type = match || null;
    }
    // Ensure all expected fields are present with default values
    const defaultNormalized = {
      chief_complaint: '',
      location: '',
      severity: null,
      onset_date: null,
      symptoms_description: [],
      relieving_factors: '',
      medical_conditions: [],
      surgeries_choice: '',
      surgeries: '',
      allergies_choice: 'No',
      allergies: [],
      current_medications: '',
      family_history: {
        hypertension: false,
        diabetes: false,
        cancer: false,
        heart_disease: false,
        unknown: false
      },
      tobacco_use: false,
      alcohol_use: false,
      drug_use: false,
      occupation: '',
      cancer_type: null
    };
    // Deep merge normalized into defaultNormalized
    const mergedNormalized = deepMerge(structuredClone(defaultNormalized), normalized || {});
    if (!normalized) {
      return new Response(JSON.stringify({
        error: 'Failed to parse OpenAI response',
        raw: data
      }), { status: 500 });
    }
    console.log('[CSA-NORMALIZE] Success, normalized:', mergedNormalized);
    return new Response(JSON.stringify({ normalized: mergedNormalized }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'OpenAI API error',
      details: String(err),
      envKeys: Object.keys(process.env || {}),
      envSample: Object.keys(process.env || {}).slice(0, 10).map(k => [k, process.env[k]]),
      openaiKeyValue: process.env.OPENAI_API_KEY || null
    }), { status: 500 });
  }

// Move deepMerge outside POST handler to avoid function declaration inside block
function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key] !== undefined ? source[key] : target[key];
    }
  }
  return target;
}
};
