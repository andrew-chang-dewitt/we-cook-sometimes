// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
import Factories from '../../testUtils/Factories'

// external dependencies
import React from 'react'

// internal dependencies
import Detail from './Detail'
import TagsList from '../tags/List'
import Content from './Content'
import ImageCarousel from './ImageCarousel'

describe('component/details/Detail', () => {
  let detail: ShallowWrapper

  const recipe = Factories.schema.RecipeCard.createWithProperties({
    id: 'id',
    name: 'name',
    tags: ['a', 'b', 'c'],
  })
  const details = Factories.schema.RecipeDetails.createWithProperties({
    desc: 'a description',
    images: [
      Factories.schema.Image.createWithProperties({ url: 'a.jpg' }),
      Factories.schema.Image.createWithProperties({ url: 'b.mp4' }),
      Factories.schema.Image.createWithProperties({ url: 'x.html' }),
    ],
  })

  before(() => {
    detail = shallow(<Detail recipe={recipe} details={details} />)
  })

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
