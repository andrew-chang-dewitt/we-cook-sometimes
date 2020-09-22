import React from 'react'

import { Tag } from '../lib/data/fetch'

import styles from './Tag.module.sass'

interface Props {
  tag: Tag
}

enum LocalColor {
  DarkGold = '#78653a',
  SlateGrey = '#60697c',
  DarkPurple = '#5e3a46',
  FernGreen = '#596e4f',
  Blue = '#3e66b7',
  Magenta = '#963958',
  Green = '#3a7361',
  DarkPink = '#a84769',
  Gold = '#866322',
  Purple = '#8655a0',
  LightGrey = '#d8d9d9',
  ForegroundLight = '#F7F4F0',
  ForegroundDark = '#373F42',
}

enum TrelloColor {
  Yellow = 'yellow',
  Black = 'black',
  Sky = 'sky',
  Lime = 'lime',
  Red = 'red',
  Green = 'green',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
  Blue = 'blue',
}

const trelloToLocalColor = (trello: string): string => {
  switch (trello) {
    case TrelloColor.Yellow:
      return LocalColor.Gold
    case TrelloColor.Black:
      return LocalColor.SlateGrey
    case TrelloColor.Sky:
      return LocalColor.DarkPurple
    case TrelloColor.Lime:
      return LocalColor.FernGreen
    case TrelloColor.Red:
      return LocalColor.DarkPink
    case TrelloColor.Green:
      return LocalColor.Green
    case TrelloColor.Orange:
      return LocalColor.DarkGold
    case TrelloColor.Pink:
      return LocalColor.Magenta
    case TrelloColor.Purple:
      return LocalColor.Purple
    case TrelloColor.Blue:
      return LocalColor.Blue
    default:
      return LocalColor.LightGrey
  }
}

const colorStyles = (
  trello: string
): { backgroundColor: string; color: string } => {
  const backgroundColor = trelloToLocalColor(trello)

  return {
    backgroundColor,
    color:
      backgroundColor === LocalColor.LightGrey
        ? LocalColor.ForegroundDark
        : LocalColor.ForegroundLight,
  }
}

export default ({ tag }: Props) => {
  const {
    // id,
    name,
    color,
  } = tag

  return (
    <li className={styles.tag} style={colorStyles(color)}>
      {name}
    </li>
  )
}
