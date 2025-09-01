const fs = require('fs');
const OpenAI = require('openai');

// Lazily create the OpenAI client so the server can start even when the
// OPENAI_API_KEY environment variable is not configured. This prevents the
// module from throwing during import which previously caused the entire
// application to fail on startup with a 502 error.
let client;
function getClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

async function callModel(model, imageBase64) {
  const client = getClient();
  return client.responses.create({
    model,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: 'Extract station name, litres, price per litre, total cost, and GST from this fuel receipt image.'
          },
          {
            type: 'input_image',
            image_url: `data:image/jpeg;base64,${imageBase64}`
          }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'FuelReceipt',
        schema: {
          type: 'object',
          properties: {
            station: { type: 'string' },
            litres: { type: 'number' },
            price_per_litre: { type: 'number' },
            total_cost: { type: 'number' },
            gst: { type: 'number' }
          },
          required: ['station', 'litres', 'price_per_litre', 'total_cost', 'gst'],
          additionalProperties: false
        }
      }
    }
  });
}

async function parseReceipt(imagePath) {
  try {
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const response = await callModel('gpt-4.1-mini', imageBase64);
    const parsed = JSON.parse(response.output_text);
    if (
      typeof parsed.station !== 'string' ||
      typeof parsed.litres !== 'number' ||
      typeof parsed.price_per_litre !== 'number' ||
      typeof parsed.total_cost !== 'number' ||
      typeof parsed.gst !== 'number'
    ) {
      throw new Error(
        'Parsing failed: missing required fields in model response.'
      );
    }
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse receipt: ${error.message}`);
  }
}

module.exports = { parseReceipt };

