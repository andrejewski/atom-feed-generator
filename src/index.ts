import { Feed } from 'feed'
import { randomUUID } from 'crypto'

export type AtomFeedEntry = {
  id: string
  title: string
  /*
    The `feed` package calls this `description` but I have to assume
    this is done because the package is trying to generate both Atom
    and other feed formats in a single package.

    We only care to do Atom so we can use precise language.
  */
  summary: string

  /*
    Same here, `feed` uses `date` but the Atom output uses the
    word `updated` consistently in its output.
  */
  updated: Date
  categories: string[]

  /*
    While relative URL paths work for some readers (e.g. Feedly),
    there are some readers that don't work well with them.

    For example, NetNewsWire wire doesn't support them:
    https://github.com/Ranchero-Software/NetNewsWire/issues/3662

    To encourage maximum compatibility, we require absolute URLs.
  */
  link: URL

  /*
    The `feed` package does type `content` as optional, but it
    wasn't clear to me what that would effect.

    I don't include the content of articles in my feed entries
    so I don't have to deal with formatting.

    I had been writing content like "Check this out on the website!"
    but that actually is worse than providing no content at all.

    Readers will display the `description` if there is no `content`
    provided, which is what I intend.
  */
  content?: string
}

export type AtomFeed = {
  id: string
  url: URL
  title: string
  // `feed` calls this "description"
  subtitle: string
  categories: string[]

  /*
    Similar to `AtomFeedEntry.link` we play it safe and assume
    absolute URLs are needed for maximum reader compatibility.
  */
  logo: URL
  icon: URL

  /*
    I only support English here for now, but make it explicit so
    you can decide if that makes sense for you.

    I can add more languages but would need to consult the spec.
    Feel free to fork or open an issue so I can gauge interest!
  */
  language: 'en'
  author: {
    name: string
    email: string
    uri: string
  }

  updated: Date
  entries: AtomFeedEntry[]
}

/*
  NOTE: I recommend formatting the XML returned with something like
  `prettier` to make it nice to read on its own.

  Since Prettier and other formatters can be a bit slow or better run
  in parallel, I leave it up to callers to format the XML.
*/
export function makeAtomXmlForFeed(feed: AtomFeed): string {
  /*
    The `feed` package specifies itself as the "generator" tool by default.
    I think this is tacky and not something I want to include in my feed.
    However, there's no clean way to remove the generator mention completely.
    So to truly remove it, I generate this unique string and then sub it out.
  */
  const generator = randomUUID()

  const feedBuilder = new Feed({
    id: feed.id,
    link: feed.url.toString(),
    title: feed.title,
    description: feed.subtitle,
    image: feed.logo.toString(),
    favicon: feed.icon.toString(),
    language: feed.language,
    author: feed.author,
    updated: feed.updated,
    /*
      Like `generator` having a copyright is pretty tacky too.
      Unlike `generator`, setting copyright to empty string does remove it from the output.
    */
    copyright: '',
    generator,
  })

  for (const category of feed.categories) {
    feedBuilder.addCategory(category)
  }

  for (const entry of feed.entries) {
    feedBuilder.addItem({
      id: entry.id,
      link: entry.link.toString(),
      title: entry.title,
      description: entry.summary,
      date: entry.updated,
      content: entry.content,
    })
  }

  const xml = feedBuilder.atom1()

  return xml.split(`<generator>${generator}</generator>`).join('')
}
