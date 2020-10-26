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
import RecipeList, {
  RecipeList as RecipeListType,
} from '../../lib/core/RecipeList'
import * as ListModule from './recipes/List'

// component under test
import Home from './Home'

describe('component/home/Home', () => {
  const publishedTag = { id: publishedTagId } as TagType

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
    describe('questions with single answers', () => {
      const includedTag = {
        id: 'included',
      } as TagType
      const excludedTag = {
        id: 'excluded',
      } as TagType

      const questions = [
        DataFactories.questions.Question.createSingleWithProperties({
          id: 'include',
          choices: [
            DataFactories.questions.Choice.createInclusionaryWithProperties({
              text: 'Include Me',
              tagsRequired: [includedTag.id],
            }),
          ],
          possibleNexts: ['exclude'],
        } as QuestionType),
        DataFactories.questions.Question.createSingleWithProperties({
          id: 'exclude',
          choices: [
            DataFactories.questions.Choice.createExclusionaryWithProperties({
              text: 'Exclude Me',
              tagsEliminated: [excludedTag.id],
            }),
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

      const recipes = RecipeList.create([
        alwaysIncluded,
        includedThenExcluded,
        alwaysExcluded,
      ])

      before(() => {
        render(
          <MemoryRouter>
            <Home recipes={recipes} questions={questions} />
          </MemoryRouter>
        )
      })
      after(() => {
        cleanup()
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

        expect(screen.getByTitle('List').textContent).to.match(
          /always included/i
        )
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

    describe('questions with multiple answers', () => {
      const includedTag = {
        id: 'included',
      } as TagType
      const alsoIncludedTag = {
        id: 'also included',
      } as TagType
      const excludedTag = {
        id: 'excluded',
      } as TagType
      const alsoExcludedTag = {
        id: 'also excluded',
      } as TagType

      interface HomeProps {
        recipes?: RecipeListType
        questions?: Array<QuestionType>
      }

      const setup = ({
        recipes = RecipeList.create([]),
        questions = [],
      }: HomeProps) =>
        render(
          <MemoryRouter>
            <Home recipes={recipes} questions={questions} />
          </MemoryRouter>
        )

      afterEach(() => {
        cleanup()
      })

      it('removes recipes on only one answer of Inclusionary type', () => {
        setup({
          recipes: RecipeList.create([
            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded only',
              tags: [publishedTag, excludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included only',
              tags: [publishedTag, includedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'include',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Include Me',
                    tagsRequired: [includedTag.id],
                  }
                ),
              ],
            }),
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /include/i }))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        expect(screen.getByTitle('List').textContent).to.match(/included only/i)
        expect(screen.getByTitle('List').textContent).to.not.match(
          /excluded only/i
        )
      })

      it('removes recipes on multiple Inclusionary answer types', async () => {
        setup({
          recipes: RecipeList.create([
            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded only',
              tags: [publishedTag, excludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included both',
              tags: [publishedTag, includedTag, alsoIncludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included one',
              tags: [publishedTag, alsoIncludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included another',
              tags: [publishedTag, includedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'include',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Include Me',
                    tagsRequired: [includedTag.id],
                  }
                ),

                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Also Me',
                    tagsRequired: [alsoIncludedTag.id],
                  }
                ),
              ],
            }),
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /include/i }))
        fireEvent.click(await screen.findByRole('button', { name: /also/i }))
        fireEvent.click(await screen.findByRole('button', { name: /submit/i }))

        expect(screen.getByTitle('List').textContent).to.match(/included both/i)
        expect(screen.getByTitle('List').textContent).to.not.match(
          /excluded only.*included one.*included another/i
        )
      })

      it('removes recipes on only one answer of Exclusionary type', () => {
        setup({
          recipes: RecipeList.create([
            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded only',
              tags: [publishedTag, excludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included both',
              tags: [publishedTag, includedTag, alsoIncludedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'exclude',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Exclude Me',
                    tagsRequired: [excludedTag.id],
                  }
                ),
              ],
            }),
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /exclude/i }))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        expect(screen.getByTitle('List').textContent).to.match(/excluded only/i)
        expect(screen.getByTitle('List').textContent).to.not.match(
          /included only/i
        )
      })

      it('removes recipes on multiple Exclusionary answer types', async () => {
        setup({
          recipes: RecipeList.create([
            DataFactories.fetch.Recipe.createWithProperties({
              id: 'included only',
              tags: [publishedTag, includedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded both',
              tags: [publishedTag, excludedTag, alsoExcludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded one',
              tags: [publishedTag, alsoExcludedTag],
            }),

            DataFactories.fetch.Recipe.createWithProperties({
              id: 'excluded another',
              tags: [publishedTag, excludedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'exclude',
              choices: [
                DataFactories.questions.Choice.createExclusionaryWithProperties(
                  {
                    text: 'Exclude Me',
                    tagsEliminated: [excludedTag.id],
                  }
                ),
                DataFactories.questions.Choice.createExclusionaryWithProperties(
                  {
                    text: 'Also Me',
                    tagsEliminated: [alsoExcludedTag.id],
                  }
                ),
              ],
            }),
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /exclude/i }))
        fireEvent.click(await screen.findByRole('button', { name: /also/i }))
        fireEvent.click(await screen.findByRole('button', { name: /submit/i }))

        expect(screen.getByTitle('List').textContent).to.match(/included only/i)
        expect(screen.getByTitle('List').textContent).to.not.match(
          /excluded both.*excluded one.*excluded another/i
        )
      })
    })
  })
})
