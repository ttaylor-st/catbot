import type { Comment } from "@ttaylor-st/discuit-ts";
import type { Command } from "../types";
import { getGifs, postFooter } from "../utils";

export const catpetCommand: Command = {
	fullName: "catpet",
	aliases: ["catpet"],
	communities: [],
	execute: async (comment: Comment) => {
		const gifs = await getGifs("cat pet");
		const gif = gifs[Math.floor(Math.random() * gifs.length)];

		await comment.comment(
			`[Here's a cat for you to pet!](${gif.url}) Via [Tenor](https://tenor.com)\n${postFooter()}`,
		);
	},
};

export default catpetCommand;
