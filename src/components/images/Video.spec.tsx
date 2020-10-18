// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

// dependencies
import React from 'react'

// component under test
import { Image as ImageType } from '../../lib/data/fetch'
import Video from './Video'

describe('components/images/Video', () => {
  it('renders a video element from a given ImageType', () => {
    const img = {
      name: 'name',
      url: 'url',
    } as ImageType

    expect(shallow(<Video data={img} />).find('video')).to.have.lengthOf(1)
  })
})
