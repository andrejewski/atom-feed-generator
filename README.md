# Atom feed generator

> The wrapper around the NPM `feed` package I use for my website feeds

```sh
npm install @andrejewski/atom-feed-generator
```

Improves upon the [`feed`](https://www.npmjs.com/package/feed) package by:

- Using richer types to encourage support for most feed readers
- Providing a simpler API that works on plain JS data instead of a class-based interface
- Removes unnecessary cruft such as generator name annotation and copyright
- Focuses only on generating Atom feeds allowing for better naming

Feedback on the generated output is appreciated.
I didn't really think that I'd have much to improve about the most popular feed reader generator package in the year 2022 but there was enough I did to work around `feed` that I thought it was worth sharing.
If I'd had the time I would have approached this as a clean room exercise, but I will document what I learn about Atom feed generators going forward in this repository.
