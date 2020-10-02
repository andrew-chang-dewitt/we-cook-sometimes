// external dependencies
import React from 'react'
import { Link } from 'react-router-dom'

// internal dependencies
import LookupContext from '../../utils/LookupContext'
import { publishedTagId } from '../Root'

interface Props {
  href: string
  children: React.ReactNode
}

export default ({ href, children }: Props) => {
  // load lookup tables to check for recipes
  const lookups = React.useContext(LookupContext)
  // if a URL exists on recipe by URL lookup table, it's a recipe
  const isRecipe = (url: string) => lookups.recipeByUrl.hasOwnProperty(url)
  // if a recipe has a tag matching the published ID, it is published
  const isPublished = (id: string) =>
    lookups.recipeByID[id].tags.some((tag) => tag.id === publishedTagId)

  // early return external link in a new tab if not a recipe
  if (!isRecipe(href))
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )

  // otherwise, get the matching recipe ID
  const recipeID = lookups.recipeByUrl[href]
  // and replace given Trello link with an internal link to the recipe
  return (
    <Link
      to={isPublished(recipeID) ? `?open=${recipeID}` : `/recipe/${recipeID}`}
    >
      {lookups.recipeByID[recipeID].name}
      {isPublished(recipeID) ? null : ' (Work in Progress)'}
    </Link>
  )
}
