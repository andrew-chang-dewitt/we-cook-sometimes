// testing tools
import 'mocha'
import { expect } from 'chai'
import { render, cleanup, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

// internal dependencies
import { Recipe } from '../../lib/data/fetch'
import LookupContext from '../../utils/LookupContext'

// component under test
import ContentLink from './ContentLink'

describe('component/detail/ContentLink', () => {
  const recipesByID = {
    'recipe-id': {
      name: 'Recipe Name',
    } as Recipe,
  }
  const recipesByUrl = {
    'https://trello.com/some-recipe': 'recipe-id',
  }
  const context = {
    recipeByID: recipesByID,
    recipeByUrl: recipesByUrl,
  }

  const setup = (href: string, Child: React.ReactNode) =>
    render(
      <MemoryRouter>
        <LookupContext.Provider value={context}>
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

  it('links to other Recipes will direct to their page on this site', async () => {
    setup('https://trello.com/some-recipe', "This won't display")

    expect(
      (await screen.findByText(/Recipe Name/i)).getAttribute('href')
    ).equals('/?open=recipe-id')
  })
})
