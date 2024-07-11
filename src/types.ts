import type { Comment } from "@ttaylor-st/discuit-ts";

export type Config = {
	username: string;
	password: string;
	baseUrl: string;
};

export type Command = {
	/** The name of the command. */
	fullName: string;
	/** The aliases of the command. */
	aliases: string[];
	/** The communities that this command should be executed in. Empty array means all communities. */
	communities: string[] | [];
	/** The function to execute when this command is called. */
	execute: (comment: Comment) => Promise<void>;
};
