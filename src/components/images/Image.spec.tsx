import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
configure({ adapter: new Adapter() })

import Factories from '../../testUtils/Factories'

import Image from './Image'

describe('components/images/Image', () => {
  it('renders a image element from a given ImageType', () => {
    const img = Factories.schema.Image.create()

    expect(shallow(<Image data={img} />).find('img')).to.have.lengthOf(1)
  })
})
