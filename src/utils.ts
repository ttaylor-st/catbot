import { config } from "./config";

export const CAT_WORDS = [
	"cat",
	"kitten",
	"feline",
	"meow",
	"purr",
	"whiskers",
	"paw",
];

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

/**
 * @name calculateCatScore
 * @description Calculates the cat score of text, based on a super-duper complex algorithm
 * @param {string} text - The text to calculate the cat score of
 * @returns {number} - The cat score of the text
 */
export const calculateCatScore = (text: string): number => {
	const words = text.split(/\s+/);
	const wordCount = words.length;
	const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
	const syllables = syllableCount(text);

	let score =
		206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);

	const lengthFactor = Math.min(1, wordCount / 100);
	score *= lengthFactor;

	const catWordCount = words.filter((word) =>
		CAT_WORDS.includes(word.toLowerCase()),
	).length;
	const catWordBonus = (catWordCount / wordCount) * 50;
	score += catWordBonus;

	return Math.round(score);
};

export const postFooter = () => {
	const link = "[here](https://discuit.net/catbot)";

	return `------
		\nMechanical meow, meow! 🤖🐱
		I am a bot, and this action was performed automatically.
		If you have any questions or concerns, please let me know ${link}! 🐾`;
};

export const getGifs = async (search: string) => {
	const encodedSearch = encodeURIComponent(`cat ${search}`);
	const response = await fetch(
		`https://tenor.googleapis.com/v2/search?q=${encodedSearch}&key=${config.tenorApiKey}&limit=10`,
	);

	const json = await response.json();
	return json.results;
};
