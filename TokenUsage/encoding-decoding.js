/**
 * token-count-tiktoken.js
 *
 * Goal:
 * Understand how tokenization works using OpenAI's tokenizer (o200k_base),
 * which is used by GPT-4o class models.
 *
 * This script:
 * - Reads a markdown file
 * - Encodes it into tokens
 * - Prints token count
 * - Decodes tokens back to text
 */

import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * ESM-safe replacement for __dirname
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize tokenizer
 * NOTE: o200k_base is the tokenizer used by GPT-4o models
 */
const tokenizer = new Tiktoken(o200k_base);

/**
 * Read input file
 */
const input = fs.readFileSync(
  path.join(__dirname, 'input.md'),
  'utf-8'
);

/**
 * Encode text into tokens
 */
const tokens = tokenizer.encode(input);

console.log('Content length (characters):', input.length);
console.log('Number of tokens:', tokens.length);

console.dir(tokens, {
  depth: null,
  maxArrayLength: 20,
});

/**
 * Decode tokens back to text
 * (useful to verify tokenizer correctness)
 */
const decoded = tokenizer.decode(tokens);
console.log('\nAfter decoding (first 300 chars):');
console.log(decoded.slice(0, 300));

/**
 * Always free the tokenizer to avoid memory leaks
 */
tokenizer.free();
