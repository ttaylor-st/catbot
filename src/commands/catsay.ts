import type { Comment } from "@ttaylor-st/discuit-ts";
import type { Command } from "../types";
import { postFooter } from "../utils";

function getCat() {
	const cats = [
		{
			name: "Fluffy",
			asciiArt: "  /\\_/\\\n" + "( o.o )\n" + " > ^ <\n",
		},
		{
			name: "Whiskers",
			asciiArt:
				"	   /\\     /\\\n" +
				"  {  `---'  }\n" +
				"  {  O   O  }\n" +
				" ~|~   V   ~|~~\n" +
				"   \\ |/   /\n" +
				"    `-----'__\n" +
				"    /       `^_\n" +
				"   {       } |\n" +
				"   |  _/  |/ /\n" +
				"    __/  /(_/\n" +
				"      (  /\n" +
				"       --",
		},
		{
			name: "Paws",
			asciiArt: " /\\_/\\\n" + "( ^.^ )\n" + " =`^`=",
		},
		{
			name: "Mittens",
			asciiArt:
				"|__ /| (`\\n" +
				"|_ _ |.--.) )\\n" +
				"( T   )     /\n" +
				"((   ) )   /",
		},
		{
			name: "Boots",
			asciiArt:
				"  /\\_/\\\n" +
				" ( o.o )\n" +
				"  > ^ <\n" +
				" /  -  \\\n" +
				" | | | |\n" +
				" | | | |\n" +
				"(__|__|__)\n",
		},
		{
			name: "Luna",
			asciiArt:
				"  /\\_/\\\n" + " ( o   o )\n" + "=(  =^=  )=\n" + '  (")_(")\n',
		},
		{
			name: "Smokey",
			asciiArt:
				"   |\\__/,|   (`\\\n" + " _.|o o  |_   ) )\n" + "-(((---(((--------\n",
		},
		{
			name: "Ginger",
			asciiArt:
				"  A_A\n" +
				" (-.=)\n" +
				"  |\\/|\n" +
				"  |  |\n" +
				"  |  |\n" +
				" (==)\n" +
				"(    )\n",
		},
	];

	const cat = cats[Math.floor(Math.random() * cats.length)];
	cat.asciiArt = cat.asciiArt.replace(/`\\/g, "\\");
	cat.asciiArt = cat.asciiArt.replace(/\t/g, "");
	cat.asciiArt = cat.asciiArt.replace(/\n/g, "\n\t");
	cat.asciiArt = `\t${cat.asciiArt}`;
	return cat;
}

function catSay(message: string): string {
	const cat = getCat();
	const maxLineLength = 40;
	const lines = [];

	let currentLine = "";
	for (const word of message.split(" ")) {
		if ((currentLine + word).length > maxLineLength) {
			lines.push(currentLine.trim());
			currentLine = "";
		}
		currentLine += `${word} `;
	}
	if (currentLine) lines.push(currentLine.trim());

	const bubbleWidth = Math.max(...lines.map((line) => line.length)) + 2;
	const top = ` ${"_".repeat(bubbleWidth)}`;
	const bottom = ` ${"-".repeat(bubbleWidth)}`;
	const bubbleLines = lines.map(
		(line) => `| ${line.padEnd(bubbleWidth - 2)} |`,
	);

	return `\t${top}\n\t${bubbleLines.join("\n\t")}\n\t${bottom}\n${cat.asciiArt}\n\t\t\t-- ${cat.name}`;
}

const catsayCommand: Command = {
	fullName: "catsay",
	aliases: ["catsay"],
	communities: [],
	execute: async (comment: Comment) => {
		let replyText = comment.body;
		const commandPosition = comment.body.indexOf("!catsay");
		if (commandPosition !== -1) {
			replyText = replyText.slice(commandPosition + "!catsay".length);
		}

		replyText = catSay(replyText);

		const reply =
			// biome-ignore lint: i'm not going to use a template literal here.
			"```\n" + `${replyText}` + "\n```";

		await comment.comment(`${reply}\n${postFooter()}`);
	},
};

export default catsayCommand;
