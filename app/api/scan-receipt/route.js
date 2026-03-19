import { NextResponse } from 'next/server';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh/v1';
const VISION_MODEL = process.env.MISTRAL_VISION_MODEL || 'mistral/pixtral-12b';

async function callPixtral(image, mimeType) {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    throw new Error('Missing AI_GATEWAY_API_KEY');
  }

  return fetch(`${AI_GATEWAY_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${image}` },
            },
            {
              type: 'text',
              text: `Analyze this receipt or product document and extract warranty-relevant information.

Return ONLY a valid JSON object with these exact fields (use null if not found):
{
  "productName": "full product name as string",
  "brand": "manufacturer or brand name as string",
  "purchaseDate": "date in YYYY-MM-DD format or null",
  "price": "purchase amount as numeric string like '299.99' with no currency symbol, or null",
  "retailer": "store or website name as string or null",
  "serial": "serial number or model number as string or null",
  "category": "one of: Electronics, Appliances, Automotive, Footwear, Clothing, Tools, Furniture, Sports, Other — or null"
}

Return ONLY the raw JSON object. No markdown fences, no explanation, no extra text.`,
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
      stream: false,
    }),
  });
}

export async function POST(request) {
  try {
    const { image, mimeType } = await request.json();
    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    let response = await callPixtral(image, mimeType);

    // Retry once on 429 after a short backoff
    if (response.status === 429) {
      await sleep(3000);
      response = await callPixtral(image, mimeType);
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway Pixtral error:', response.status, errText);
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit reached — wait a few seconds and try again.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Vision API error — check your AI Gateway key and model access.' }, { status: 502 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    const content = Array.isArray(rawContent)
      ? rawContent.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('').trim()
      : (typeof rawContent === 'string' ? rawContent : '').trim();

    // Strip any accidental markdown fences
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON in Pixtral response:', content);
      return NextResponse.json({ error: 'Could not read receipt — try a clearer photo.' }, { status: 422 });
    }

    const extracted = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, data: extracted });
  } catch (err) {
    console.error('scan-receipt error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
