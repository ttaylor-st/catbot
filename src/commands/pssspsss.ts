import type { Comment } from "@ttaylor-st/discuit-ts";
import type { Command } from "../types";
import { getGifs, postFooter } from "../utils";

export const pssspsCommand: Command = {
	fullName: "pssspsss",
	aliases: ["pssspsss"],
	communities: [],
	execute: async (comment: Comment) => {
		const possibilities = [
			{ text: "Meow? Did someone call?", search: "cat hello" },
			{ text: "Human, you summoned me?", search: "cat hello" },
			{ text: "*ears perk up* Treats?", search: "cat wants treats" },
			{ text: "I'm coming, but only because I want to.", search: "cat come" },
			{ text: "*stretches lazily* Oh, it's you.", search: "cat stretch" },
			{ text: "*sudden zoomies* Catch me if you can!", search: "cat zoomies" },
			{ text: "I shall grace you with my presence, human.", search: "cat" },
			{ text: "*tail swish* Intriguing, do continue.", search: "cat tail hit" },
			{
				text: "Meow meow (translation: What do you want?)",
				search: "cat what",
			},
			{ text: "*kneads paws* This better be good.", search: "cat kneading" },
			{
				text: "I was napping, this better involve food.",
				search: "cat waking up",
			},
			{
				text: "*slow blink* Ah, my loyal subject calls.",
				search: "cat slow blink",
			},
			{
				text: "Purrrrhaps I'll investigate... after my bath.",
				search: "cat licking self",
			},
		];

		const option =
			possibilities[Math.floor(Math.random() * possibilities.length)];
		const message = option.text;
		const gifs = await getGifs(option.search);
		const gif = gifs[Math.floor(Math.random() * gifs.length)];

		await comment.comment(
			`[${message}](${gif.url}) Via [Tenor](https://tenor.com)\n${postFooter()}`,
		);
	},
};

export default pssspsCommand;
