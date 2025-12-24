
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { qaPairs } = body;
    if (!qaPairs || !Array.isArray(qaPairs)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid qaPairs' }), { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), { status: 500 });
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

    const prompt = `You are a medical intake assistant. Given the following Q&A pairs from a patient intake conversation, extract and return a JSON object with these fields:

  - chief_complaint (string)
  - location (string)
  - severity (number, 1-10, as a number not a word)
  - onset_date (string, ISO format YYYY-MM-DD, if user provides a duration or date, otherwise null)
  - symptoms_description (array of strings)
  - relieving_factors (string)
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

  If the user mentions a duration for symptoms (e.g., "past 4 days", "for 2 weeks", "since last Monday"), calculate the onset_date as today's date minus the specified duration, and return it as an ISO date string (YYYY-MM-DD). If a specific date is mentioned, use that date. If not, set onset_date to null.

  If the user mentions any allergies, set allergies_choice to "Yes" and list all allergies in the allergies array. If not, set allergies_choice to "No" and allergies to an empty array.

  If family_history.cancer is true and the user provides a cancer type, match it to the closest valid option from this list: ${validCancerTypes.join(", ")}. If no close match, return null.

  Return only the JSON object. Ensure all values are in the correct type and format for direct use in a React form.

  Q&A pairs:\n${qaPairs.map((q: any, i: number) => `${i+1}. Q: ${q.question}\nA: ${q.answer}`).join('\n')}\n\nReturn only the JSON object.`;

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
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
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
    if (!normalized) {
      return new Response(JSON.stringify({ error: 'Failed to parse OpenAI response', raw: data }), { status: 500 });
    }
    return new Response(JSON.stringify({ normalized }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'OpenAI API error', details: String(err) }), { status: 500 });
  }
};
