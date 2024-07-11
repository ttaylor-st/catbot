import type { Config } from "./types";
import * as fs from "node:fs";

export const config: Config = JSON.parse(
	fs.readFileSync("./config.json", "utf-8"),
);
