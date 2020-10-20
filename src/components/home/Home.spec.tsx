// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import DataFactories from '../../testUtils/Factories'

// dependencies
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import {
  publishedTagId,
  Tag as TagType,
  Recipe as RecipeType,
} from '../../lib/data/fetch'
import { Question as QuestionType } from '../../lib/data/questions'
import RecipeList from '../../lib/core/RecipeList'
import * as ListModule from './recipes/List'

// component under test
import Home from './Home'

describe('component/home/Home', () => {
  const publishedTag = { id: publishedTagId } as TagType

  const recipe1 = DataFactories.fetch.Recipe.createWithProperties({
    id: 'recipe one',
    tags: [publishedTag],
  } as RecipeType)
  const recipe2 = DataFactories.fetch.Recipe.createWithProperties({
    id: 'recipe two',
    tags: [publishedTag],
  } as RecipeType)
  const recipe3 = DataFactories.fetch.Recipe.createWithProperties({
    id: 'recipe three',
    tags: [publishedTag],
  } as RecipeType)
  const recipe4 = DataFactories.fetch.Recipe.createWithProperties({
    id: 'recipe unpublished',
  } as RecipeType)

  const recipes = RecipeList.create([recipe1, recipe2, recipe3, recipe4])

  let ListStub: SinonStub<any, any>
  const ListFake = ({ recipes }: { recipes: Array<RecipeType> }) => (
    <div title="List">{JSON.stringify(recipes)}</div>
  )

  before(() => {
    // stubbing out List because it's well tested (along with it's
    // child components), but requires some stubbing/mocking of
    // several external I/O interfaces that aren't related to
    // this component
    ListStub = sinon
      .stub(ListModule, 'default')
      // List renders from a RecipeList's remaining property, stub
      // renders a stringify-ed version of that property to examine
      // for changes based on changes to the RecipeList passed
      // to List
      // FIXME: This doesn't work because it doesn't re-render on
      // props change; needs to do a callsFake instead of returns
      // with something like (props) => (Stuff to render) I think
      .callsFake(ListFake)
  })
  after(() => {
    ListStub.restore()
    cleanup()
  })

  it('starts showing all published recipes', () => {
    render(
      <MemoryRouter>
        <Home
          recipes={recipes}
          questions={[DataFactories.questions.Question.create()]}
        />
      </MemoryRouter>
    )

    expect(screen.getByTitle('List').textContent).to.match(
      /recipe one.*recipe two.*recipe three/i
    )
    expect(screen.getByTitle('List').textContent).to.not.match(
      /recipe unpublished/i
    )

    cleanup()
  })

  describe('answering questions', () => {
    const includedTag = {
      id: 'included',
    }
    const excludedTag = {
      id: 'excluded',
    }

    const questions = [
      DataFactories.questions.Question.createWithProperties({
        id: 'include',
        choices: [
          DataFactories.questions.Choice.createInclusionary('Include Me', [
            includedTag.id,
          ]),
        ],
        possibleNexts: ['exclude'],
      } as QuestionType),
      DataFactories.questions.Question.createWithProperties({
        id: 'exclude',
        choices: [
          DataFactories.questions.Choice.createExclusionary('Exclude Me', [
            excludedTag.id,
          ]),
        ],
      } as QuestionType),
    ]

    const alwaysIncluded = DataFactories.fetch.Recipe.createWithProperties({
      id: 'always included',
      tags: [publishedTag, includedTag],
    } as RecipeType)
    const includedThenExcluded = DataFactories.fetch.Recipe.createWithProperties(
      {
        id: 'included then excluded',
        tags: [publishedTag, includedTag, excludedTag],
      } as RecipeType
    )
    const alwaysExcluded = DataFactories.fetch.Recipe.createWithProperties({
      id: 'always excluded',
      tags: [publishedTag, excludedTag],
    } as RecipeType)

    const answerQuestionRecipes = RecipeList.create([
      alwaysIncluded,
      includedThenExcluded,
      alwaysExcluded,
    ])

    before(() => {
      render(
        <MemoryRouter>
          <Home recipes={answerQuestionRecipes} questions={questions} />
        </MemoryRouter>
      )
    })

    it('removes recipes on Inclusionary answer types', () => {
      fireEvent.click(screen.getByRole('button', { name: /include/i }))

      expect(screen.getByTitle('List').textContent).to.match(
        /always included.*included then excluded/i
      )
      expect(screen.getByTitle('List').textContent).to.not.match(
        /always excluded/i
      )
    })

    it('removes recipes on Exclusionary answer types', async () => {
      fireEvent.click(await screen.findByRole('button', { name: /exclude/i }))

      expect(screen.getByTitle('List').textContent).to.match(/always included/i)
      expect(screen.getByTitle('List').textContent).to.not.match(
        /included then excluded.*always excluded/i
      )
    })

    it('returns recipes to previous state when the user goes to the previous question', () => {
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))

      expect(screen.getByTitle('List').textContent).to.match(
        /always included.*included then excluded/i
      )
      expect(screen.getByTitle('List').textContent).to.not.match(
        /always excluded/i
      )
    })

    it('returns recipes to initial state when the user resets the questions', () => {
      fireEvent.click(screen.getByRole('button', { name: /start over/i }))

      expect(screen.getByTitle('List').textContent).to.match(
        /always included.*included then excluded.*always excluded/i
      )
    })
  })
})
