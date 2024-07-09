import * as fs from "node:fs";
import { type Comment, DiscuitClient } from "discuit-ts";
import { logger } from "./Logger";
import { Watcher } from "./Watcher";
import type { Config } from "./types";

const config: Config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const client = new DiscuitClient({
	baseURL: "https://discuit.ttaylor.run.place/api/",
});

const user = await client.login(config.username, config.password);
logger.info(`Successfully logged in as ${user.username}`);

const watcher = new Watcher(client);
watcher.startWatching();
watcher.on("newPost", (post) => {
	logger.info(`New post: ${post.title}`);
});

watcher.on("newComment", (comment: Comment) => {
	logger.info(`New comment: ${comment.body}`);
});
