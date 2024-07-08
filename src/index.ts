import * as fs from "node:fs";
import { DiscuitClient } from "discuit-ts";
import { logger } from "./Logger";
import type { Config } from "./types";

const config: Config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const client = new DiscuitClient({
	baseURL: "https://discuit.net/api/",
});

await client.initialize();
const user = await client.login(config.username, config.password);
logger.info(`Successfully logged in as ${user.username}`);
