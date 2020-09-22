import 'mocha'
import { expect } from 'chai'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Tag as TagData } from '../../lib/data/fetch'
import Tag from '../Tag'
import Image from '../Image'

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
    expect(card.find(Tag)).to.have.lengthOf(3)
  })

  it('renders a cover image for the recipe', () => {
    expect(card.find(Image)).to.have.lengthOf(1)
  })
})
