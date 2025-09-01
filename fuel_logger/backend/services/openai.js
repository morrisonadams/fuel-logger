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

// Extract the first JSON object found in a string. This helps us safely parse
// model responses that may include additional commentary before or after the
// JSON payload.
function extractFirstJsonObject(text) {
  const start = text.indexOf('{');
  if (start === -1) {
    return null;
  }
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i - 1] !== '\\') {
      inString = !inString;
    } else if (!inString) {
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
    }
  }
  return null;
}

async function parseReceipt(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`[parseReceipt] Image file not found: ${imagePath}`);
      throw new Error(`Image not found at ${imagePath}`);
    }

    console.log(`[parseReceipt] Reading image from ${imagePath}`);
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    console.log('[parseReceipt] Sending image to model');
    const response = await callModel('gpt-4.1-mini', imageBase64);

    // The model should return pure JSON thanks to the json_schema option, but
    // in practice we occasionally see additional text or code fences wrapped
    // around the payload. Attempt to extract the first JSON object found in the
    // response before parsing so that trailing explanations do not cause a
    // SyntaxError such as "Unexpected non-whitespace character after JSON".
    const text = response.output_text.trim();
    const json = extractFirstJsonObject(text);
    if (!json) {
      console.error('[parseReceipt] Model response did not contain JSON:', text);
      throw new Error('Model response did not contain JSON');
    }

    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch (parseError) {
      console.error('[parseReceipt] Failed to parse JSON:', parseError, json);
      throw new Error(`Invalid JSON from model: ${parseError.message}`);
    }

    if (
      typeof parsed.station !== 'string' ||
      typeof parsed.litres !== 'number' ||
      typeof parsed.price_per_litre !== 'number' ||
      typeof parsed.total_cost !== 'number' ||
      typeof parsed.gst !== 'number'
    ) {
      console.error('[parseReceipt] Missing required fields:', parsed);
      throw new Error(
        'Parsing failed: missing required fields in model response.'
      );
    }

    console.log('[parseReceipt] Successfully parsed receipt:', parsed);
    return parsed;
  } catch (error) {
    console.error('[parseReceipt] Error:', error);
    throw new Error(`Failed to parse receipt: ${error.message}`);
  }
}

module.exports = { parseReceipt };

