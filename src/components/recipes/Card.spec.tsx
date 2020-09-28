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
    card = shallow(<Card recipe={recipe} />)
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
    card = shallow(<Card recipe={noImage} />)
    expect(card.find(Image)).to.have.lengthOf(0)
  })

  it('includes details when a user clicks the card', () => {
    // include event object w/ prevent default method because it
    // doesn't seem to be passed automatically by Enzyme
    card.childAt(0).simulate('click', { preventDefault: () => {} })

    expect(card.find(DetailLoader)).to.have.lengthOf(1)
  })
})
