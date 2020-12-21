// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import DataFactories from '../../testUtils/Factories'

// external dependencies
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

// internal dependencies
import { publishedTagId } from '../../lib/data/fetch'
import { RecipeCard as RecipeType } from '../../lib/data/schema'
import { Question as QuestionType } from '../../lib/data/questions'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../../lib/core/RecipeList'
import * as ListModule from './recipes/List'

// component under test
import Home from './Home'

describe('component/home/Home', () => {
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
    const recipe1 = DataFactories.schema.RecipeCard.createWithProperties({
      id: 'recipe one',
      tags: [publishedTagId],
    })
    const recipe2 = DataFactories.schema.RecipeCard.createWithProperties({
      id: 'recipe two',
      tags: [publishedTagId],
    })
    const recipe3 = DataFactories.schema.RecipeCard.createWithProperties({
      id: 'recipe three',
      tags: [publishedTagId],
    })
    const recipe4 = DataFactories.schema.RecipeCard.createWithProperties({
      id: 'recipe unpublished',
    })

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
      const includedTag = 'included'
      const excludedTag = 'excluded'

      const questions = [
        DataFactories.questions.Question.createSingleWithProperties({
          id: 'include',
          choices: [
            DataFactories.questions.Choice.createInclusionaryWithProperties({
              text: 'Include Me',
              tagsRequired: [includedTag],
            }),
          ],
          possibleNexts: ['exclude'],
        } as QuestionType),
        DataFactories.questions.Question.createSingleWithProperties({
          id: 'exclude',
          choices: [
            DataFactories.questions.Choice.createExclusionaryWithProperties({
              text: 'Exclude Me',
              tagsEliminated: [excludedTag],
            }),
          ],
        } as QuestionType),
      ]

      const alwaysIncluded = DataFactories.schema.RecipeCard.createWithProperties(
        {
          id: 'always included',
          tags: [publishedTagId, includedTag],
        }
      )
      const includedThenExcluded = DataFactories.schema.RecipeCard.createWithProperties(
        {
          id: 'included then excluded',
          tags: [publishedTagId, includedTag, excludedTag],
        }
      )
      const alwaysExcluded = DataFactories.schema.RecipeCard.createWithProperties(
        {
          id: 'always excluded',
          tags: [publishedTagId, excludedTag],
        }
      )

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
      const includedTag = 'included'
      const alsoIncludedTag = 'also included'
      const excludedTag = 'excluded'
      const alsoExcludedTag = 'also excluded'

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
            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded only',
              tags: [publishedTagId, excludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included only',
              tags: [publishedTagId, includedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'include',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Include Me',
                    tagsRequired: [includedTag],
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
            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded only',
              tags: [publishedTagId, excludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included both',
              tags: [publishedTagId, includedTag, alsoIncludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included one',
              tags: [publishedTagId, alsoIncludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included another',
              tags: [publishedTagId, includedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'include',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Include Me',
                    tagsRequired: [includedTag],
                  }
                ),

                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Also Me',
                    tagsRequired: [alsoIncludedTag],
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
            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded only',
              tags: [publishedTagId, excludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included both',
              tags: [publishedTagId, includedTag, alsoIncludedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'exclude',
              choices: [
                DataFactories.questions.Choice.createInclusionaryWithProperties(
                  {
                    text: 'Exclude Me',
                    tagsRequired: [excludedTag],
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
            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'included only',
              tags: [publishedTagId, includedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded both',
              tags: [publishedTagId, excludedTag, alsoExcludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded one',
              tags: [publishedTagId, alsoExcludedTag],
            }),

            DataFactories.schema.RecipeCard.createWithProperties({
              id: 'excluded another',
              tags: [publishedTagId, excludedTag],
            }),
          ]),

          questions: [
            DataFactories.questions.Question.createMultiWithProperties({
              id: 'exclude',
              choices: [
                DataFactories.questions.Choice.createExclusionaryWithProperties(
                  {
                    text: 'Exclude Me',
                    tagsEliminated: [excludedTag],
                  }
                ),
                DataFactories.questions.Choice.createExclusionaryWithProperties(
                  {
                    text: 'Also Me',
                    tagsEliminated: [alsoExcludedTag],
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
