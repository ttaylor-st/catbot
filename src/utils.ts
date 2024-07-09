/**
 * @name countInWord
 * @description Counts the number of syllables in a single word using simple vowel count
 * @param {string} word - The word to count syllables
 * @returns {number} - The number of syllables in the word
 */
export const countInWord = (word: string): number => {
	let newWord = word.toLowerCase();
	if (newWord.length <= 3) {
		return 1;
	}
	newWord = newWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
	newWord = newWord.replace(/^y/, "");
	return (newWord.match(/[aeiouy]{1,2}/g) || ["boop."]).length;
};

/**
 * @name syllableCount
 * @description Returns the number of syllables in a sentence
 * @param {string} sentence - The sentence to count syllables
 * @returns {number} - The number of syllables in the sentence
 */
export const syllableCount = (sentence: string): number => {
	const words = sentence.split(" ");
	let syllableCount = 0;

	for (const word of words) {
		syllableCount += countInWord(word);
	}

	return syllableCount;
};
