import { EventEmitter } from "node:events";
import type { DiscuitClient } from "@ttaylor-st/discuit-ts";

/**
 * @name Watcher
 * @description Watches for new posts and comments on Discuit.
 * @extends EventEmitter
 * @param {DiscuitClient} client - The client to use for making requests.
 * @example
 * const watcher = new PostWatcher(client, user, logger);
 * watcher.startWatching();
 *
 * watcher.on("newPost", (post) => { console.log(post); });
 * watcher.on("newComment", (comment) => { console.log(comment); });
 */
export class Watcher extends EventEmitter {
	/** The posts that have already been memorised. */
	private memorisedPosts: Set<string> = new Set();
	/** The comments that have already been memorised. */
	private memorisedComments: Set<string> = new Set();
	/** The `DiscuitClient` to use for making requests. */
	private client: DiscuitClient;
	/** The time to start watching from. Posts and comments created before this time will be ignored. */
	private readonly after: number;

	/**
	 * @param {DiscuitClient} client - The client to use for making requests.
	 */
	constructor(client: DiscuitClient) {
		super();
		this.client = client;
		this.after = Date.now();
	}

	/**
	 * @name watchForNewPosts
	 * @description Watches for new posts on Discuit and emits a "newPost" event when a new post is found.
	 * @returns {Promise<void>}
	 */
	async watchForNewPosts(): Promise<void> {
		const response = await this.client.getPosts();
		for (const post of response.posts) {
			if (this.memorisedPosts.has(post.id)) continue;
			if (new Date(post.createdAt).getTime() < this.after) continue;

			this.memorisedPosts.add(post.id);
			this.emit("newPost", post);
		}
	}

	/**
	 * @name watchForNewComments
	 * @description Watches for new comments on Discuit and emits a "newComment" event when a new comment is found.
	 * @returns {Promise<void>}
	 */
	async watchForNewComments(): Promise<void> {
		const response = await this.client.getPosts({
			sort: "activity",
			comments: true,
			limit: 10,
		});
		const posts = response.posts;
		for (const post of posts) {
			if (!post.comments) continue;
			for (const comment of post.comments) {
				if (this.memorisedComments.has(comment.id)) continue;
				if (new Date(comment.createdAt).getTime() < this.after) continue;

				this.memorisedComments.add(comment.id);
				this.emit("newComment", comment);
			}
		}
	}

	startWatching(interval = 5000): void {
		setInterval(() => this.watchForNewComments(), interval);
		setInterval(() => this.watchForNewPosts(), interval);
	}
}
