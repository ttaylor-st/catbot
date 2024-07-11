import { config } from "./../config";
import type { Comment } from "@ttaylor-st/discuit-ts";
import { postFooter } from "../utils";
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

		const response = await fetch(
			`https://tenor.googleapis.com/v2/search?q=cat+${reaction}&key=${config.tenorApiKey}&client_key=${config.username}`,
		);

		const json = await response.json();
		const gif = json.results[Math.floor(Math.random() * json.results.length)];

		await comment.upvote();
		await comment.comment(
			`[Here's your ${reaction} cat!](${gif.url}) Via [Tenor](https://tenor.com)\n${postFooter()}`,
		);
	},
};

export default catreactCommand;
