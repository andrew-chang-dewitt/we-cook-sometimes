import React from 'react'

import { Tag as TagType } from '../../lib/data/schema'
import Tag from './Tag'

import styles from './List.module.sass'

interface Props {
  tags: Array<TagType>
}

const hiddenTags = ['published', 'Big Meal Idea']

export default ({ tags }: Props) => (
  <ul className={styles.tagsList}>
    {tags
      .filter((tag) => !hiddenTags.includes(tag.name))
      .map((tag) => (
        <Tag tag={tag} key={tag.id} />
      ))}
  </ul>
)
