// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import Factories from '../../../testUtils/Factories'

// external dependencies
import React from 'react'

// internal dependencies
import { RecipeCard } from '../../../lib/data/schema'
import { publishedTagId } from '../../../lib/data/fetch'
import LookupContext, {
  LookupTables,
  TagByID,
} from '../../../utils/LookupContext'
import * as DetailLoader from '../../detail/DetailLoader'
// import Close from '../../icons/Close'

// component under test
import Card from './Card'

describe('component/recipes/Card', () => {
  const defaultRecipe = Factories.schema.RecipeCard.createWithProperties({
    name: 'A Recipe',
    tags: ['tagID'],
  })

  const defaultContext = {
    recipeByID: {},
    recipeByUrl: {},
    tagsByID: {
      tagID: Factories.schema.Tag.createWithProperties({ id: 'tagID' }),
    },
  }

  const createTagsContext = (ids: Array<string>): LookupTables => ({
    ...defaultContext,
    tagsByID: ids.reduce((hashed, id) => {
      hashed[id] = Factories.schema.Tag.createWithProperties({ id })

      return hashed
    }, {} as TagByID),
  })

  const setup = (
    recipe: RecipeCard = defaultRecipe,
    context: LookupTables = defaultContext,
    handler: (arg?: any) => void = () => {},
    open: boolean = false
  ) =>
    render(
      <LookupContext.Provider value={context}>
        <Card recipe={recipe} detailsOpen={open} openHandler={handler} />
      </LookupContext.Provider>
    )

  const setupWithTags = (ids: Array<string>) =>
    setup(
      Factories.schema.RecipeCard.createWithProperties({ tags: ids }),
      createTagsContext(ids)
    )

  afterEach(() => cleanup())

  it('renders the recipe title', () => {
    setup()

    expect(screen.getByRole('heading', { level: 3 }).textContent).to.match(
      /A Recipe/
    )
  })

  it('renders a list of Tags', () => {
    setupWithTags(['one tag'])

    expect(screen.getByRole('list').children).to.have.lengthOf(1)
  })

  it('renders a cover image for the recipe', () => {
    setup(
      Factories.schema.RecipeCard.createWithProperties({
        ...defaultRecipe,
        cover: Factories.schema.Image.create(),
      })
    )

    expect(screen.getByRole('img')).to.exist
  })

  it('skips the image, if there is no cover Id', () => {
    setup(
      Factories.schema.RecipeCard.createWithProperties({
        ...defaultRecipe,
        cover: null,
      })
    )

    expect(() => screen.getByRole('img')).to.throw(/unable to find/i)
  })

  it('displays an ellipsis indicating there is more to see about a recipe', () => {
    setup()

    expect(screen.getByTitle('See more...')).to.exist
  })

  describe('work in progress', () => {
    it("indicates if a recipe isn't tagged as published", () => {
      setupWithTags([])

      expect(screen.getByRole('heading', { level: 3 }).textContent).to.match(
        /WIP/
      )
    })

    it('indicates if a recipe is tagged as published', () => {
      setupWithTags([publishedTagId])

      expect(
        screen.getByRole('heading', { level: 3 }).textContent
      ).to.not.match(/WIP/)
    })
  })

  describe('open details', () => {
    let DetailLoaderStub: SinonStub<any, any>
    const DetailLoaderFake = ({ recipe }: { recipe: RecipeCard }) => (
      <div title="details">{JSON.stringify(recipe)}</div>
    )

    const setupOpenCard = () => setup(undefined, undefined, undefined, true)

    before(() => {
      // stubbing out List because it's an imperative layer & it's
      // child components are well tested
      DetailLoaderStub = sinon
        .stub(DetailLoader, 'default')
        .callsFake(DetailLoaderFake)
    })
    after(() => {
      DetailLoaderStub.restore()
    })

    it('includes details when the detailsOpen prop is true', () => {
      setupOpenCard()

      expect(screen.getByTitle('details')).to.exist
    })

    it('displays an x icon indicating the details can be closed', () => {
      setupOpenCard()

      expect(screen.getByTitle('Close')).to.exist
    })

    it("and doesn't display the 'See More...' icon", () => {
      setupOpenCard()

      expect(() => screen.getByTitle('See more...')).to.throw(/unable to find/i)
    })

    describe('delegates a user clicking the x or ellipsis buttons to the consumer', () => {
      it('passes the recipe ID to the handler if the card is not yet open', () => {
        let handlerCalledWith = ''

        const recipe = Factories.schema.RecipeCard.createWithProperties({
          id: 'id',
          tags: [],
        })
        const handler = (arg: string) => {
          handlerCalledWith = arg
        }

        setup(recipe, undefined, handler, false)

        fireEvent.click(screen.getByRole('link'))

        expect(handlerCalledWith).to.equal(recipe.id)
      })

      it('passes an empty string to the handler if the card is already open', () => {
        let handlerCalledWith = 'an id'
        const recipe = Factories.schema.RecipeCard.createWithProperties({
          id: 'id',
          tags: [],
        })
        const handler = (arg: string) => {
          handlerCalledWith = arg
        }

        setup(recipe, undefined, handler, true)

        fireEvent.click(screen.getByRole('link'))
        expect(handlerCalledWith).to.equal('')
      })
    })
  })
})
