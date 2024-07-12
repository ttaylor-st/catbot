import { config } from "./../config";
import type { Comment } from "@ttaylor-st/discuit-ts";
import { getGifs, postFooter } from "../utils";
import type { Command } from "../types";

export const catreactCommand: Command = {
	fullName: "catreact",
	aliases: ["catreact"],
	communities: [],
	execute: async (comment: Comment) => {
		let reaction = comment.body;
		const commandPosition = comment.body.indexOf("!catreact");
		if (commandPosition !== -1) {
			reaction = reaction.slice(commandPosition + "!catreact".length);
			reaction = reaction.split(" ")[0] || reaction;
		}

		const gifs = await getGifs(reaction);
		const gif = gifs[Math.floor(Math.random() * gifs.length)];

		await comment.comment(
			`[Here's your ${reaction} cat!](${gif.url}) Via [Tenor](https://tenor.com)\n${postFooter()}`,
		);
	},
};

export default catreactCommand;
