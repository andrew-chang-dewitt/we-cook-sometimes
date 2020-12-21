// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

// dependencies
import React from 'react'

// component under test
import Factories from '../../testUtils/Factories'
import Video from './Video'

describe('components/images/Video', () => {
  it('renders a video element from a given ImageType', () => {
    const img = Factories.schema.Image.create()

    expect(shallow(<Video data={img} />).find('video')).to.have.lengthOf(1)
  })
})
