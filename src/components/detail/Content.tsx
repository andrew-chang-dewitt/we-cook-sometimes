// external libs
import React from 'react'
import unified from 'unified'
import parse from 'remark-parse'
import markdownToReact from 'remark-react'

import Link from './Link'

import styles from './Content.module.sass'

interface Props {
  data: string
}

export default ({ data }: Props) => (
  <div className={styles.content}>
    {
      unified()
        .use(parse)
        // FIXME: pass options.toHast.handlers.heading
        // to customized Markdown Headings to be
        // rendered as 1 size smaller than they are
        // written as
        // Currently just keeping the tag (this is bad
        // semantics) & changing the size in CSS
        .use(markdownToReact, {
          remarkReactComponents: {
            a: Link,
          },
        })
        .processSync(data).result as HTMLDivElement
    }
  </div>
)
