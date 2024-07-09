import { expect, test, describe } from "bun:test";
import { countInWord, syllableCount } from "../src/utils";

describe("syllable count", () => {
	test("countInWord", () => {
		expect(countInWord("hello")).toBe(2);
		expect(countInWord("world")).toBe(1);
		expect(countInWord("javascript")).toBe(3);
		expect(countInWord("typescript")).toBe(3);
		expect(countInWord("syllable")).toBe(3);
	});

	test("syllableCount", () => {
		expect(syllableCount("hello world")).toBe(3);
		expect(syllableCount("javascript typescript")).toBe(6);
		expect(syllableCount("syllable count")).toBe(4);
	});
});
