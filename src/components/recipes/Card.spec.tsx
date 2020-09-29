import 'mocha'
import { expect } from 'chai'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Tag as TagData } from '../../lib/data/fetch'
import TagList from '../tags/List'
import ImageLoader from '../images/ImageLoader'
import DetailLoader from '../detail/DetailLoader'
import More from '../icons/More'
import Close from '../icons/Close'

import Card from './Card'

describe('src/component/recipes/Card', () => {
  const recipe = {
    id: 'a recipe',
    name: 'A Recipe',
    tags: [
      ('1' as any) as TagData,
      ('2' as any) as TagData,
      ('3' as any) as TagData,
    ],
    idList: 'a list',
    idAttachmentCover: 'img',
  }

  let card: ShallowWrapper<any, any>

  before(() => {
    card = shallow(<Card recipe={recipe} detailsOpen={false} />)
  })

  it('renders the recipe title', () => {
    expect(card.find('h3').text()).to.equal('A Recipe')
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
    card = shallow(<Card recipe={noImage} detailsOpen={false} />)
    expect(card.find(Image)).to.have.lengthOf(0)
  })

  it('displays an ellipsis indicating there is more to see about a recipe', () => {
    expect(card.find(More)).to.have.lengthOf(1)
  })

  describe('open details', () => {
    before(() => {
      card = shallow(<Card recipe={recipe} detailsOpen={true} />)
    })

    it('includes details when the detailsOpen prop is true', () => {
      expect(card.find(DetailLoader)).to.have.lengthOf(1)
    })

    it('and it displays an x icon indicating the details can be closed', () => {
      expect(card.find(Close)).to.have.lengthOf(1)
    })
  })
})
