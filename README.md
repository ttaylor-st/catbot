# cat bot

cat bot is a bot for discuit written in typescript using the [discuit-ts]
library.

## development


first, make sure you have [bun] installed.

then clone the repository and install the dependencies:
```bash
git clone https://codeberg.org/ttaylor-st/catbot
cd catbot
bun install
```

i encourage that, when testing functionality, you use a locally hosted
instance of discuit. check [self-hosting] on the discuit documentation for
more information.

to run the bot, use the following command:
```bash
bun run start
```

to run tests, use the following command:
```bash
bun run test
```


## license

cat bot is licensed under the MIT license, view [LICENSE](./LICENSE) for more
information.


[discuit-ts]: https://github.com/ttaylor-st/discuit-ts
[bun]: https://bun.sh/
[self-hosting]: https://docs.discuit.net/self-hosting
