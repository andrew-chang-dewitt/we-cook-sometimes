// testing tools
import 'mocha'
import { expect, use } from 'chai'
import ChaiDom from 'chai-dom'
use(ChaiDom)
import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'

// internal dependencies
import {
  Question as QuestionType,
  Choice as ChoiceType,
} from '../../../lib/data/questions'

// component under test
import Question from './Question'

describe('component/questions/Question', () => {
  const question = {
    text: 'A question',
    choices: [
      {
        text: 'A choice',
      },
    ],
  } as QuestionType
  const answers = ['An answer']

  afterEach(() => {
    cleanup()
  })

  describe('question text', () => {
    it('renders the current question', () => {
      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      expect(screen.getByText(/a question/i)).to.exist
    })

    it('allows the user to answer the question', () => {
      let answerSubmitted: any = null

      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={(answer: ChoiceType) => {
            answerSubmitted = answer
          }}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /a choice/i }))

      expect(answerSubmitted.text).to.equal('A choice')
    })

    it('alerts the user if they have answered all the questions', () => {
      render(
        <Question
          question={null}
          submittedAnswers={[]}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      expect(screen.getByText(/no more questions/i)).to.exist
    })
  })

  describe('previous', () => {
    it('allows the user to go back to a previous question', () => {
      let previousCalled = false

      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {
            previousCalled = true
          }}
          previousExists={true}
          reset={() => {}}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))

      expect(previousCalled).to.be.true
    })

    it("doesn't allow the user to go back if on the first question", () => {
      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={false}
          reset={() => {}}
        />
      )

      expect(() => screen.getByRole('button', { name: /previous/i })).to.throw(
        /unable to find/i
      )
    })
  })

  describe('reset', () => {
    it('allows the user to reset the questions', () => {
      let resetCalled = false

      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {
            resetCalled = true
          }}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /start over/i }))

      expect(resetCalled).to.be.true
    })

    it("doesn't allow the user to reset if on the first question", () => {
      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={false}
          reset={() => {}}
        />
      )

      expect(() =>
        screen.getByRole('button', { name: /start over/i })
      ).to.throw(/unable to find/i)
    })
  })

  describe('answers', () => {
    it('shows the user the already chosen answers', () => {
      render(
        <Question
          question={question}
          submittedAnswers={answers}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      expect(screen.getByText(/filtering by/i)).to.exist
      expect(screen.getByText(/an answer/i)).to.exist
    })

    it("shows nothing if the user hasn't answered any questions yet", () => {
      render(
        <Question
          question={question}
          submittedAnswers={[]}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      expect(() => screen.getByText(/filtering by/i)).to.throw(
        /unable to find/i
      )
    })
  })

  describe('collapse question', () => {
    it('can collapse the current question to free up screen space', () => {
      render(
        <Question
          question={question}
          submittedAnswers={[]}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /collapse/i }))

      expect(screen.getByText(/a question/i)).to.not.be.visible
      expect(screen.getByText(/a choice/i)).to.not.be.visible
    })

    it('can expand a collapsed question', () => {
      render(
        <Question
          question={question}
          submittedAnswers={[]}
          submitAnswer={() => {}}
          previous={() => {}}
          previousExists={true}
          reset={() => {}}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /collapse/i }))
      fireEvent.click(screen.getByRole('button', { name: /expand/i }))

      expect(screen.getByText(/a question/i)).to.be.visible
      expect(screen.getByText(/a choice/i)).to.be.visible
    })
  })
})
