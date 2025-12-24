/**
 * SubwordLevelTokenizer
 *
 * A simplified, educational subword tokenizer inspired by BPE.
 * This is NOT production-grade BPE — it’s meant to help understand:
 *
 * - How vocabularies grow from characters → subwords
 * - Why subword tokenization reduces token counts
 * - Longest-match-first tokenization
 */
class SubwordLevelTokenizer {
  constructor(dataset, maxVocabularySize = 100) {
    this.dataset = dataset;
    this.maxVocabularySize = maxVocabularySize;

    // token <-> id mappings
    this.mapping = {};
    this.reverseMapping = {};

    // vocabulary set
    this.vocabulary = new Set();

    this.buildVocabulary();
  }

  /**
   * Build vocabulary by iteratively adding frequent character pairs
   */
  buildVocabulary() {
    // Start with unique characters
    const chars = [...new Set(this.dataset.split(''))];
    chars.forEach((char) => this.vocabulary.add(char));

    let currentVocabulary = new Set(this.vocabulary);

    while (currentVocabulary.size < this.maxVocabularySize) {
      const pairs = this.getMostFrequentPairs(
        this.dataset,
        currentVocabulary
      );

      if (pairs.length === 0) break;

      // Add most frequent new subword
      const newSubword = pairs[0];
      currentVocabulary.add(newSubword);
      this.vocabulary = new Set(currentVocabulary);
    }

    // Create token ↔ id mappings
    const vocabArray = Array.from(this.vocabulary);
    for (let i = 0; i < vocabArray.length; i++) {
      const token = vocabArray[i];
      this.mapping[token] = i;
      this.reverseMapping[i] = token;
    }
  }

  /**
   * Find most frequent adjacent character pairs
   */
  getMostFrequentPairs(text, vocabulary) {
    const pairCounts = {};

    for (let i = 0; i < text.length - 1; i++) {
      const pair = text[i] + text[i + 1];
      pairCounts[pair] = (pairCounts[pair] || 0) + 1;
    }

    return Object.entries(pairCounts)
      .filter(
        ([pair, count]) => !vocabulary.has(pair) && count > 1
      )
      .sort(([, a], [, b]) => b - a)
      .map(([pair]) => pair);
  }

  /**
   * Tokenize text using longest-match-first over vocabulary
   */
  tokenizeWithVocabulary(text, vocabulary) {
    const tokens = [];
    let i = 0;

    while (i < text.length) {
      let found = false;

      for (
        let length = Math.min(text.length - i, 10);
        length > 0;
        length--
      ) {
        const candidate = text.slice(i, i + length);
        if (vocabulary.has(candidate)) {
          tokens.push(candidate);
          i += length;
          found = true;
          break;
        }
      }

      if (!found) {
        tokens.push(text[i]);
        i++;
      }
    }

    return tokens;
  }

  /**
   * Encode text → token ids
   */
  encode(text) {
    const tokens = this.tokenizeWithVocabulary(
      text,
      this.vocabulary
    );
    return tokens.map((token) => this.mapping[token]);
  }

  /**
   * Decode token ids → text
   */
  decode(tokens) {
    return tokens
      .map((token) => this.reverseMapping[token])
      .join('');
  }

  /**
   * Inspect learned vocabulary
   */
  getVocabulary() {
    return Array.from(this.vocabulary);
  }
}

/**
 * -------------------------------
 * Example usage
 * -------------------------------
 */

const dataset =
  'the cat sat on the mat the cat sat on the mat the cat sat on the mat';

const tokenizer = new SubwordLevelTokenizer(dataset, 50);

const input = 'cat sat mat';

const tokens = tokenizer.encode(input);

console.dir(tokenizer.mapping)

// console.log('Input:', input);
// console.log('Input length (characters):', input.length);
// console.log('Encoded tokens:', tokens);
// console.log('Number of tokens:', tokens.length);

console.log('Decoded:', tokenizer.decode(tokens));
