export const runtime = "nodejs";

import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
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
    const body = await req.json();
    const todayIso = new Date().toISOString().split('T')[0];
    const serviceOptions = [
      "Dot Test",
      "Immigration Medical Exams",
      "Wart Removal",
      "Weight loss Program",
      "Blood Tests",
      "Seniors",
      "Children Healthcare",
      "Ear Cleaning",
      "Diabetes",
      "PSA Test",
      "EKG",
      "Pap Smear",
      "Dentist",
      "Ingrown Toenail Removal",
      "Primary Care",
      "Ultrasound",
      "Thyroid Care",
    ];
    const normalizedSnapshot = body?.normalizedSnapshot || body?.normalized || null;
    const rawMergedPayload = body?.rawMergedPayload || null;

    // Extract onset date and service from normalized snapshot first, then fall back to raw payload
    const rawOnset = normalizedSnapshot?.onset_date || rawMergedPayload?.onset_date || rawMergedPayload?.symptomDuration || null;
    const rawService = normalizedSnapshot?.service || rawMergedPayload?.service || null;

    console.log('[CSA-NORMALIZE] Extracted fields', { rawOnset, rawService });

    // Send only the two fields to OpenAI for lightweight normalization
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Normalize onset_date and service. Today is ${todayIso}. If onset_date is a duration (e.g., "2 days"), convert it to an ISO date (YYYY-MM-DD) by subtracting from today; if already a date string, keep it; if unknown, null. For service, choose the closest match (semantic or fuzzy) from service_options; if nothing is close, return null. Return JSON only with keys onset_date and service.`
          },
          {
            role: 'user',
            content: JSON.stringify({ onset_date: rawOnset, service: rawService, service_options: serviceOptions })
          }
        ],
        temperature: 0,
        max_tokens: 120,
      }),
    });

    const text = await response.text();
    console.log('[CSA-NORMALIZE] OpenAI raw response:', text);

    let normalized: any = null;
    try {
      const parsed = JSON.parse(text);
      const content = parsed?.choices?.[0]?.message?.content;
      if (content) {
        try {
          normalized = JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) normalized = JSON.parse(match[0]);
        }
      }
    } catch (err) {
      console.error('[CSA-NORMALIZE] Failed to parse OpenAI response text', err);
    }

    if (!normalized) {
      return new Response(JSON.stringify({
        error: 'Failed to normalize fields',
        raw: text
      }), { status: 500 });
    }

    return new Response(JSON.stringify({ normalized }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'OpenAI API error',
      details: String(err),
      envKeys: Object.keys(process.env || {}),
      envSample: Object.keys(process.env || {}).slice(0, 10).map(k => [k, process.env[k]]),
      openaiKeyValue: process.env.OPENAI_API_KEY || null
    }), { status: 500 });
  }
};
