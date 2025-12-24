/**
 * token-usage-experiment.js
 *
 * PRIMARY GOAL:
 * Understand how token usage is calculated across different LLM providers
 * using the same prompt via a unified SDK.
 *
 * What this file demonstrates:
 * - Input token count vs output token count
 * - Differences in tokenization across providers
 * - Why the same prompt can result in different costs
 *
 * Requirements:
 * - Node.js 18+
 * - "type": "module" in package.json
 */

import 'dotenv/config';

import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Keep the prompt simple for easier token reasoning
 */
const PROMPT = 'Hello, world!';


/**
 * Pretty-print token usage information
 *
 * @param {string} provider - Model provider (Anthropic / Google)
 * @param {string} model - Model name
 * @param {object} usage - Token usage metadata returned by the SDK
 */
function logTokenUsage(provider, model, usage) {
  console.log(`\n[${provider} | ${model}]`);

  if (!usage) {
    console.log('No token usage data returned.');
    return;
  }

  console.log('Token usage breakdown:');
  for (const [key, value] of Object.entries(usage)) {
    console.log(`  ${key}: ${value}`);
  }
}

/**
 * -------------------------------
 * Anthropic (Claude) Token Study
 * -------------------------------
 *
 * Claude uses its own tokenizer.
 * Even a simple prompt can produce different token counts
 * compared to Gemini or OpenAI models.
 */
const anthropicResponse = await generateText({
  model: anthropic('claude-3-5-haiku-latest'),
  prompt: PROMPT,
});

logTokenUsage(
  'Anthropic',
  'claude-3-5-haiku-latest',
  anthropicResponse.usage
);

console.log('Generated text:', anthropicResponse.text);

/**
 * -------------------------------
 * Google (Gemini) Token Study
 * -------------------------------
 *
 * Gemini models tokenize text differently than Claude.
 * This difference is what we want to observe.
 */
const googleResponse = await generateText({
  model: google('gemini-2.0-flash-lite'),
  prompt: PROMPT,
});

logTokenUsage(
  'Google',
  'gemini-2.0-flash-lite',
  googleResponse.usage
);

console.log('Generated text:', googleResponse.text);

console.log('Anthropic key loaded:', !!process.env.ANTHROPIC_API_KEY);
console.log('Google key loaded:', !!process.env.GOOGLE_API_KEY);

/**
 * Key Things to Observe:
 *
 * 1. Input tokens:
 *    - Same string, different token counts
 *    - Tokenizers are model-specific
 *
 * 2. Output tokens:
 *    - Response style affects token usage
 *
 * 3. Total tokens:
 *    - Cost is based on total tokens (input + output)
 *
 * Suggested Next Experiments:
 * - Increase prompt length gradually
 * - Compare system prompt vs user prompt
 * - Add structured JSON output
 * - Log estimated cost per provider
 */
