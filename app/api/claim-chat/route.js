import { NextResponse } from 'next/server';

function stripMarkdown(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/gs, '$1')   // bold+italic
    .replace(/\*\*(.+?)\*\*/gs, '$1')        // bold
    .replace(/\*(.+?)\*/gs, '$1')            // italic
    .replace(/_{2}(.+?)_{2}/gs, '$1')        // __bold__
    .replace(/_(.+?)_/gs, '$1')              // _italic_
    .replace(/`{3}[\s\S]*?`{3}/g, '')        // code blocks
    .replace(/`(.+?)`/g, '$1')              // inline code
    .replace(/^#{1,6}\s+/gm, '')             // headings
    .replace(/^\s*[-*+]\s+/gm, '• ')         // unordered list → bullet
    .replace(/^\s*\d+\.\s+/gm, '')           // numbered list markers
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')      // links → just label
    .replace(/!\[.*?\]\(.+?\)/g, '')         // images
    .replace(/^[-_*]{3,}$/gm, '—')           // horizontal rules
    .replace(/\n{3,}/g, '\n\n')              // collapse excess newlines
    .trim();
}

export async function POST(request) {
  try {
    const { messages, warrantyContext } = await request.json();

    const {
      productName = 'Unknown product',
      brand = null,
      category = null,
      purchaseDate = null,
      expiryDate = null,
      retailer = null,
      serial = null,
      price = null,
      status = 'unknown',
    } = warrantyContext || {};

    const systemPrompt = `You are an expert warranty claims assistant. Help users understand their rights and file claims.

WARRANTY ON FILE:
Product: ${productName}${brand ? ` by ${brand}` : ''}
Category: ${category || 'Unknown'}
Purchase Date: ${purchaseDate || 'Unknown'}
Expiry Date: ${expiryDate || 'Unknown'}
Status: ${status.toUpperCase()}
Retailer: ${retailer || 'Unknown'}
Serial / Model: ${serial || 'Unknown'}
Purchase Price: ${price ? '$' + price : 'Unknown'}

INSTRUCTIONS:
- Help the user understand whether their issue is covered under warranty
- Advise on documentation to gather (receipt, photos of defect, proof of purchase)
- Draft professional claim letters when asked, addressed to the manufacturer or retailer
- Guide them through the claims process step by step
- Suggest escalation options (BBB, credit card chargeback, small claims court) if needed
- Write in plain, clear prose. Do not use markdown, asterisks, pound signs, backticks, or any special formatting characters. Use plain sentences and paragraphs only.
- Keep responses under 250 words unless drafting a letter.`;

    // Use mistral-small-latest (reliable, fast); devstral is code-focused and not suited here
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'devstral-2512',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 1200,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral claim-chat error:', response.status, errText);
      return NextResponse.json({ error: 'AI service unavailable — try again.' }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    const clean = stripMarkdown(raw);

    return NextResponse.json({ success: true, message: clean });
  } catch (err) {
    console.error('claim-chat error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
