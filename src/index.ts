import * as fs from "node:fs";
import { type Comment, DiscuitClient } from "@ttaylor-st/discuit-ts";
import { logger } from "./Logger";
import { Watcher } from "./Watcher";
import { config } from "./config";

const commands = fs.readdirSync("./src/commands").map((file) => {
	return require(`./commands/${file}`).default;
});

const client = new DiscuitClient({
	baseURL: config.baseUrl,
});

await client.initialize();
const user = await client.login(config.username, config.password);
logger.info(`Successfully logged in as ${user.username}`);

const watcher = new Watcher(client);
watcher.startWatching();
watcher.on("newPost", (post) => {
	logger.info(`New post: ${post.title}`);
});

watcher.on("newComment", async (comment: Comment) => {
	if (
		comment.author.username === config.username &&
		!comment.body.includes("#human")
	) {
		return;
	}

	for (const command of commands) {
		if (
			command.aliases.some((alias: string) =>
				comment.body.includes(`!${alias}`),
			)
		) {
			logger.info(
				`Running command ${command.fullName} for ${comment.author.username}`,
			);
			await command.execute(comment);
		}
	}
});

process.on("uncaughtException", (err: Error, origin: string) => {
	logger.error(`Uncaught exception at ${origin}: ${err}`);
});

process.on(
	"unhandledRejection",
	(reason: Error | unknown, promise: Promise<unknown>) => {
		logger.error(`Unhandled exception at ${promise}: ${reason}`);
	},
);
