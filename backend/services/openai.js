const fs = require('fs');
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callModel(model, imageBase64) {
  return client.responses.parse({
    model,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: 'Extract litres, price per litre, and total cost from this fuel receipt image. Respond with JSON matching the given schema.'
          },
          { type: 'input_image', image_base64: imageBase64 }
        ]
      }
    ],
    schema: {
      type: 'object',
      properties: {
        litres: { type: 'number' },
        price_per_litre: { type: 'number' },
        total_cost: { type: 'number' }
      },
      required: ['litres', 'price_per_litre', 'total_cost']
    }
  });
}

async function parseReceipt(imagePath) {
  try {
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    let response;
    try {
      response = await callModel('gpt5-nano', imageBase64);
    } catch (err) {
      response = await callModel('gpt-4.1-mini', imageBase64);
    }
    const parsed = response.output?.[0]?.content?.[0]?.parsed;
    if (
      !parsed ||
      typeof parsed.litres !== 'number' ||
      typeof parsed.price_per_litre !== 'number' ||
      typeof parsed.total_cost !== 'number'
    ) {
      throw new Error('Parsing failed: missing numeric fields in model response.');
    }
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse receipt: ${error.message}`);
  }
}

module.exports = { parseReceipt };
