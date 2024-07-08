import * as fs from "node:fs";
import * as path from "node:path";

interface Colours {
	[key: string]: string;
}

const colours: Colours = {
	PRIMARY: "#007bff",
	INFO: "#17a2b8",
	SUCCESS: "#28a745",
	WARNING: "#ffc107",
	ERROR: "#dc3545",
	LIGHT: "#f8f9fa",
	DARK: "#343a40",
	WHITE: "#ffffff",
	BLACK: "#000000",
};

type LogType = "WARNING" | "ERROR" | "SUCCESS" | "INFO";

interface TypeColours {
	[key: string]: (text: string) => string;
}

const typeColours: TypeColours = {
	WARNING: (text: string) => `\x1b[30m\x1b[43m\x1b[1m${text}\x1b[0m`,
	ERROR: (text: string) => `\x1b[37m\x1b[41m\x1b[1m${text}\x1b[0m`,
	SUCCESS: (text: string) => `\x1b[30m\x1b[42m\x1b[1m${text}\x1b[0m`,
	INFO: (text: string) => `\x1b[30m\x1b[46m\x1b[1m${text}\x1b[0m`,
	DATE: (text: string) => `\x1b[37m\x1b[40m\x1b[1m${text}\x1b[0m`,
	LOGGER: (text: string) => `\x1b[37m\x1b[40m\x1b[1m${text}\x1b[0m`,
};

const loggers: Logger[] = [];

class Logger {
	public readonly logFileName: string;
	public readonly logFilePath: string;
	private logTypes: LogType[];
	private maxLogTypeLength: number;
	private name: string;
	private short: string;
	private silent: boolean;

	constructor(name = "", short: string = name, silent = false) {
		this.logFileName = this.getFormattedFileName(name);
		this.logFilePath = path.join(__dirname, "./../logs", this.logFileName);
		this.logTypes = ["WARNING", "ERROR", "SUCCESS", "INFO"];
		this.maxLogTypeLength = this.getMaxLogTypeLength();
		this.name = name;
		this.short = short;
		this.silent = silent;
		this.ensureLogDirectory();

		loggers.push(this);

		if (!this.silent) {
			this.log(
				"SUCCESS",
				`New logger ${typeColours.LOGGER(` ${this.name} `)} created`,
			);
			this.log(
				"INFO",
				`Logging to ${this.logFilePath.split("/").slice(-2).join("/")}`,
			);
		}
	}

	private getFormattedFileName(name: string): string {
		const now = new Date();
		const date = now.toISOString().slice(0, 10);
		const time = now.toTimeString().slice(0, 8).replace(/:/g, "-");
		return `${date}_${time}${name ? `_${name}` : ""}.log`;
	}

	private getMaxLogTypeLength(): number {
		return this.logTypes.reduce((max, type) => Math.max(max, type.length), 0);
	}

	private formatLogType(type: string): string {
		const padding = " ".repeat(this.maxLogTypeLength - type.length);
		const centered = ` ${padding.slice(0, padding.length / 2)}${type}${padding.slice(padding.length / 2)} `;
		return centered.toUpperCase();
	}

	private formatName(short: string): string {
		const maxNameLength = loggers.reduce(
			(max, logger) => Math.max(max, logger.short.length),
			0,
		);
		const padding = " ".repeat(maxNameLength - short.length);
		const centered = ` ${padding.slice(0, padding.length / 2)}${short}${padding.slice(padding.length / 2)} `;
		return centered.toUpperCase();
	}

	private ensureLogDirectory(): void {
		const logDir = path.join(__dirname, "../../logs");
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}
	}

	public separator(): void {
		console.log();
		this.writeToFile("");
	}

	public log(type: LogType, text: string): void {
		if (!this.logTypes.includes(type)) {
			throw new Error(`Invalid log type: ${type}`);
		}

		const date = new Date()
			.toLocaleString("en-gb", { month: "short", day: "numeric" })
			.toUpperCase();
		const timestamp = new Date().toLocaleTimeString("en-gb", { hour12: false });
		const formattedName = this.formatName(this.short);

		console.log(
			`${typeColours.LOGGER(` ${formattedName} `)} ${typeColours.DATE(` ${date} | `)}${typeColours.DATE(`${timestamp} `)} ${typeColours[type](`${this.formatLogType(type)}`)} ${text}`,
		);
		const formattedLog = `[${date} | ${timestamp}] ${this.formatLogType(type)} | ${text}`;
		this.writeToFile(formattedLog);
	}

	private writeToFile(log: string): void {
		fs.appendFile(this.logFilePath, `${log}\n`, (err) => {
			if (err) console.error(typeColours.ERROR(`[ERROR] | ${err}`));
		});
	}

	public warn(text: string): void {
		this.log("WARNING", text);
	}

	public error(text: string): void {
		this.log("ERROR", text);
	}

	public success(text: string): void {
		this.log("SUCCESS", text);
	}

	public info(text: string): void {
		this.log("INFO", text);
	}
}

const systemLogger = new Logger("logger", "logger", true);
const logger = new Logger("main", "main");
let terminated = false;

function processKilled(reason: string): void {
	if (terminated) return;
	terminated = true;
	systemLogger.separator();
	systemLogger.log("INFO", `Process terminated, reason: ${reason}`);
	for (const logger of loggers) {
		logger.log("INFO", `Find this log at ${logger.logFilePath}`);
	}
	process.exit(0);
}

const events = [
	"SIGUSR1",
	"SIGUSR2",
	"SIGTERM",
	"SIGPIPE",
	"SIGHUP",
	"SIGTERM",
	"SIGINT",
	"SIGBREAK",
	"exit",
];
for (const event of events) {
	process.on(event as NodeJS.Signals, processKilled.bind(null, event));
}

export { Logger, logger };
