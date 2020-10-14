import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Image as ImageType } from '../../lib/data/fetch'
import Image from './Image'

describe('components/Image', () => {
  it('fetches image data from a given card & attachment Id, then renders an image', () => {
    const img = {
      name: 'name',
      url: 'url',
      edgeColor: 'color',
    } as ImageType

    expect(shallow(<Image data={img} />).find('img')).to.have.lengthOf(1)
  })
})
