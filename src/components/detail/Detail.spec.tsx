import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Tag, Image, Recipe, RecipeDetails } from '../../lib/data/fetch'

import Detail from './Detail'
import TagsList from '../tags/List'
import Content from './Content'
import ImageCarousel from './ImageCarousel'

describe('src/component/details/Detail', () => {
  const recipe = {
    id: 'id',
    name: 'name',
    tags: ([1, 2, 3] as Array<unknown>) as Array<Tag>,
  } as Recipe
  const details = {
    desc: 'a description',
    images: ([1, 2, 3] as Array<unknown>) as Array<Image>,
  } as RecipeDetails
  const detail = shallow(<Detail recipe={recipe} details={details} />)

  it("renders the given recipe's title", () => {
    expect(detail.find('h2').first().text()).to.equal('name')
  })

  it("renders the given recipe's tags", () => {
    expect(detail.find(TagsList)).to.have.lengthOf(1)
  })

  it('renders the given recipe', () => {
    expect(detail.find(Content)).to.have.lengthOf(1)
  })

  it("renders the given recipe's images", () => {
    expect(detail.find(ImageCarousel)).to.have.lengthOf(1)
  })
})
