// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
import React from 'react'

// internal dependencies
import { publishedTagId, Tag as TagType } from '../../../lib/data/fetch'
import TagList from '../../tags/List'
import ImageLoader from '../../images/ImageLoader'
import DetailLoader from '../../detail/DetailLoader'
import More from '../../icons/More'
import Close from '../../icons/Close'
import WIP from '../../WIPTag'

// component under test
import Card from './Card'

describe('component/recipes/Card', () => {
  const recipe = {
    id: 'a recipe',
    name: 'A Recipe',
    shortLink: 'a url',
    tags: [
      ('1' as any) as TagType,
      ('2' as any) as TagType,
      ('3' as any) as TagType,
    ],
    idList: 'a list',
    idAttachmentCover: 'img',
  }

  let card: ShallowWrapper<any, any>

  before(() => {
    card = shallow(
      <Card recipe={recipe} detailsOpen={false} openHandler={() => {}} />
    )
  })

  it('renders the recipe title', () => {
    expect(card.find('h3').text()).to.match(/A Recipe/)
  })

  it('renders a list of Tags', () => {
    expect(card.find(TagList)).to.have.lengthOf(1)
  })

  it('renders a cover image for the recipe', () => {
    expect(card.find(ImageLoader)).to.have.lengthOf(1)
  })

  it('skips the image, if there is no cover Id', () => {
    const noImage = {
      ...recipe,
      idAttachmentCover: null,
    }
    card = shallow(
      <Card recipe={noImage} detailsOpen={false} openHandler={() => {}} />
    )
    expect(card.find(Image)).to.have.lengthOf(0)
  })

  it('displays an ellipsis indicating there is more to see about a recipe', () => {
    expect(card.find(More)).to.have.lengthOf(1)
  })

  describe('work in progress', () => {
    it("indicates if a recipe isn't tagged as published", () => {
      const wip = {
        ...recipe,
        tags: [],
      }
      const rendered = shallow(
        <Card recipe={wip} detailsOpen={false} openHandler={() => {}} />
      )

      expect(rendered.find('h3').contains(<WIP />)).to.be.true
    })

    it("indicates if a recipe isn't tagged as published", () => {
      const wip = {
        ...recipe,
        tags: [{ id: publishedTagId } as TagType],
      }
      const rendered = shallow(
        <Card recipe={wip} detailsOpen={false} openHandler={() => {}} />
      )

      expect(rendered.find('h3').contains(<WIP />)).to.be.false
    })
  })

  describe('open details', () => {
    before(() => {
      card = shallow(
        <Card recipe={recipe} detailsOpen={true} openHandler={() => {}} />
      )
    })

    it('includes details when the detailsOpen prop is true', () => {
      expect(card.find(DetailLoader)).to.have.lengthOf(1)
    })

    it('displays an x icon indicating the details can be closed', () => {
      expect(card.find(Close)).to.have.lengthOf(1)
    })

    describe('delegates a user clicking the x or ellipsis buttons to the consumer', () => {
      it('passes the recipe ID to the handler if the card is not yet open', () => {
        let handlerCalledWith = ''

        card = shallow(
          <Card
            recipe={recipe}
            detailsOpen={false}
            openHandler={(arg: string) => {
              handlerCalledWith = arg
            }}
          />
        )

        card.find('a').simulate('click', { preventDefault: () => {} })

        expect(handlerCalledWith).to.equal(recipe.id)
      })

      it('passes an empty string to the handler if the card is already open', () => {
        let handlerCalledWith = 'an id'

        card = shallow(
          <Card
            recipe={recipe}
            detailsOpen={true}
            openHandler={(arg: string) => {
              handlerCalledWith = arg
            }}
          />
        )

        card.find('a').simulate('click', { preventDefault: () => {} })

        expect(handlerCalledWith).to.equal('')
      })
    })
  })
})
