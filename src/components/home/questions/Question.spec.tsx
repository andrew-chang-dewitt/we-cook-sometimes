// testing tools
import 'mocha'
import { expect, use } from 'chai'
import ChaiDom from 'chai-dom'
use(ChaiDom)
import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import Factories from '../../../testUtils/Factories'

// internal dependencies
import {
  Question as QuestionType,
  Choice as ChoiceType,
} from '../../../lib/data/questions'

// component under test
import Question from './Question'

interface QuestionProps {
  question?: QuestionType | null
  submittedAnswers?: Array<string>
  submitHandlers?: [
    (answer: ChoiceType) => void,
    (answers: Array<ChoiceType>) => void
  ]
  previous?: () => void
  previousExists?: boolean
  reset?: () => void
}

describe('component/questions/Question', () => {
  const setup = ({
    question = Factories.questions.Question.create(),
    submittedAnswers = [],
    submitHandlers = [() => {}, () => {}],
    previous = () => {},
    previousExists = false,
    reset = () => {},
  }: QuestionProps) => {
    render(
      <Question
        question={question}
        submittedAnswers={submittedAnswers}
        submitHandlers={submitHandlers}
        previous={previous}
        previousExists={previousExists}
        reset={reset}
      />
    )
  }

  afterEach(() => {
    cleanup()
  })

  describe('question content', () => {
    it('renders the current question', () => {
      setup({
        question: Factories.questions.Question.createSingleWithProperties({
          text: 'A question',
        }),
      })

      expect(screen.getByText(/a question/i)).to.exist
    })
  })

  describe('answering questions', () => {
    describe('single choice questions', () => {
      it('allows the user to answer the question', () => {
        let answerSubmitted: any = null

        setup({
          question: Factories.questions.Question.createSingleWithProperties({
            choices: [
              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'A choice',
              }),

              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'Not chosen',
              }),

              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'Also not chosen',
              }),
            ],
          }),

          submitHandlers: [
            (answer) => {
              answerSubmitted = answer
            },
            () => {},
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /a choice/i }))

        expect(answerSubmitted.text).to.equal('A choice')
      })
    })

    describe('multiple choice questions', () => {
      it('allows the user to answer with multiple choices', () => {
        let answerSubmitted: any = null

        setup({
          question: Factories.questions.Question.createMultiWithProperties({
            choices: [
              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'First selected',
              }),

              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'Also selected',
              }),

              Factories.questions.Choice.createInclusionaryWithProperties({
                text: 'Not selected',
              }),
            ],
          }),

          submitHandlers: [
            () => {},
            (answer) => {
              answerSubmitted = answer
            },
          ],
        })

        fireEvent.click(screen.getByRole('button', { name: /first selected/i }))
        fireEvent.click(screen.getByRole('button', { name: /also selected/i }))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        expect(JSON.stringify(answerSubmitted)).to.match(
          /first selected.*also selected/i
        )
        expect(JSON.stringify(answerSubmitted)).to.not.match(/not selected/i)
      })
    })

    it('alerts the user if they have answered all the questions', () => {
      setup({
        question: null,
      })

      expect(screen.getByText(/no more questions/i)).to.exist
    })
  })

  describe('previous', () => {
    it('allows the user to go back to a previous question', () => {
      let previousCalled = false

      setup({
        previous: () => {
          previousCalled = true
        },
        previousExists: true,
      })

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))

      expect(previousCalled).to.be.true
    })

    it("doesn't allow the user to go back if on the first question", () => {
      setup({
        previousExists: false,
      })

      expect(() => screen.getByRole('button', { name: /previous/i })).to.throw(
        /unable to find/i
      )
    })
  })

  describe('reset', () => {
    it('allows the user to reset the questions', () => {
      let resetCalled = false

      setup({
        previousExists: true,
        reset: () => {
          resetCalled = true
        },
      })

      fireEvent.click(screen.getByRole('button', { name: /start over/i }))

      expect(resetCalled).to.be.true
    })

    it("doesn't allow the user to reset if on the first question", () => {
      setup({
        previousExists: false,
      })

      expect(() =>
        screen.getByRole('button', { name: /start over/i })
      ).to.throw(/unable to find/i)
    })
  })

  describe('answers', () => {
    it('shows the user the already chosen answers', () => {
      setup({
        submittedAnswers: ['An answer'],
      })

      expect(screen.getByText(/filtering by/i)).to.exist
      expect(screen.getByText(/an answer/i)).to.exist
    })

    it("shows nothing if the user hasn't answered any questions yet", () => {
      setup({
        submittedAnswers: [],
      })

      expect(() => screen.getByText(/filtering by/i)).to.throw(
        /unable to find/i
      )
    })
  })

  describe('collapse question', () => {
    it('can collapse the current question to free up screen space', () => {
      setup({
        question: Factories.questions.Question.createSingleWithProperties({
          text: 'A question',
          choices: [
            Factories.questions.Choice.createInclusionaryWithProperties({
              text: 'A choice',
            }),
          ],
        }),
      })

      fireEvent.click(screen.getByRole('button', { name: /collapse/i }))

      expect(screen.getByText(/a question/i)).to.not.be.visible
      expect(screen.getByText(/a choice/i)).to.not.be.visible
    })

    it('can expand a collapsed question', () => {
      setup({
        question: Factories.questions.Question.createSingleWithProperties({
          text: 'A question',
          choices: [
            Factories.questions.Choice.createInclusionaryWithProperties({
              text: 'A choice',
            }),
          ],
        }),
      })

      fireEvent.click(screen.getByRole('button', { name: /collapse/i }))
      fireEvent.click(screen.getByRole('button', { name: /expand/i }))

      expect(screen.getByText(/a question/i)).to.be.visible
      expect(screen.getByText(/a choice/i)).to.be.visible
    })

    it('can collapse the no more questions placeholder', () => {
      setup({
        question: null,
      })

      fireEvent.click(screen.getByRole('button', { name: /collapse/i }))

      expect(screen.getByText(/no more/i)).to.not.be.visible
    })
  })
})
