// testing tools
import 'mocha'
import { expect } from 'chai'
import { render, cleanup, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

// internal testing tools
import Factories from '../../testUtils/Factories'

// internal dependencies
import LookupContext, { LookupTables } from '../../utils/LookupContext'
import { publishedTagId } from '../../lib/data/fetch'

// component under test
import ContentLink from './ContentLink'

describe('component/detail/ContentLink', () => {
  const recipesByID = {
    'recipe-id': Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe-id',
      name: 'Recipe Name',
      tags: [publishedTagId],
    }),
  }
  const recipesByUrl = {
    shortLink: 'recipe-id',
  }
  const context = {
    recipeByID: recipesByID,
    recipeByUrl: recipesByUrl,
    tagsByID: {},
  }

  const setup = (
    href: string,
    Child: React.ReactNode,
    ctx: LookupTables = context
  ) =>
    render(
      <MemoryRouter>
        <LookupContext.Provider value={ctx}>
          <ContentLink href={href}>{Child}</ContentLink>
        </LookupContext.Provider>
      </MemoryRouter>
    )

  afterEach(() => {
    cleanup()
  })

  it('creates an `a` tag link using a given `href` & children', async () => {
    setup('destination', 'Child')

    expect(await screen.findByText(/child/i)).to.exist
    expect((await screen.findByText(/child/i)).getAttribute('href')).equals(
      'destination'
    )
  })

  it('links to published recipes open their card on the list', async () => {
    setup('https://trello.com/c/shortLink/some-recipe', "This won't display")

    expect(
      (await screen.findByText(/Recipe Name/i)).getAttribute('href')
    ).equals('/?open=recipe-id')
  })

  it('links to unpublished recipes open an unlisted /recipes/:id ', async () => {
    const byID = {
      'recipe-id': Factories.schema.RecipeCard.createWithProperties({
        id: 'recipe-id',
        name: 'Recipe Name',
        tags: ['unpublished'],
      }),
    }
    const byUrl = { unpublishedShortLink: 'recipe-id' }

    setup(
      'https://trello.com/c/unpublishedShortLink/recipe',
      "This won't display",
      { recipeByID: byID, recipeByUrl: byUrl, tagsByID: {} }
    )

    expect(
      (await screen.findByText(/Recipe Name/i)).getAttribute('href')
    ).equals('/recipe/recipe-id')
  })
})
