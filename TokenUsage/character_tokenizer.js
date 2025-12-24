/**
 * CharacterLevelTokenizer
 *
 * A simple character-level tokenizer to demonstrate:
 * - How token vocabularies are built
 * - Why character-level tokenization leads to many tokens
 * - How encoding/decoding works at the lowest level
 *
 * This is intentionally simple for learning purposes.
 */
class CharacterLevelTokenizer {
  constructor(dataset) {
    this.dataset = dataset;

    // char -> token id
    this.mapping = {};

    // token id -> char
    this.reverseMapping = {};

    // Build vocabulary from unique characters in dataset
    const uniqueChars = [...new Set(this.dataset.split(''))];

    for (let i = 0; i < uniqueChars.length; i++) {
      const char = uniqueChars[i];
      this.mapping[char] = i;
      this.reverseMapping[i] = char;
    }
  }

  /**
   * Encode text into character-level tokens
   * @param {string} text
   * @returns {number[]}
   */
  encode(text) {
    return text.split('').map((char) => {
      if (!(char in this.mapping)) {
        throw new Error(`Unknown character: "${char}"`);
      }
      return this.mapping[char];
    });
  }

  /**
   * Decode tokens back into text
   * @param {number[]} tokens
   * @returns {string}
   */
  decode(tokens) {
    return tokens
      .map((token) => {
        if (!(token in this.reverseMapping)) {
          throw new Error(`Unknown token id: ${token}`);
        }
        return this.reverseMapping[token];
      })
      .join('');
  }
}

/**
 * -------------------------------
 * Example usage
 * -------------------------------
 */

const dataset = 'the cat sat on the mat';
const tokenizer = new CharacterLevelTokenizer(dataset);

const input = 'cat sat mat';

const tokens = tokenizer.encode(input);
console.dir(tokenizer.mapping);


// console.log('Input:', input);
// console.log('Input length (characters):', input.length);
// console.log('Encoded tokens:', tokens);
// console.log('Number of tokens:', tokens.length);

// Optional: verify decoding
const decoded = tokenizer.decode(tokens);
console.log('Decoded text:', decoded);
