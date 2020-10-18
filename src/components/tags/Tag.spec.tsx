import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Tag as TagType } from '../../lib/data/fetch'

import Tag from './Tag'

describe('component/Tag', () => {
  it("renders a tag's name from a given tag", () => {
    const tag = {
      name: 'a tag',
    } as TagType

    expect(
      shallow(<Tag tag={tag} />)
        .find('li')
        .text()
    ).to.equal('a tag')
  })

  describe('color mappings from trello to local styles', () => {
    let tag = {
      name: 'a tag',
    } as TagType

    const setup = (t: TagType) => {
      return shallow(<Tag tag={t} />).get(0).props.style
    }

    it('defaults to a light grey background', () => {
      expect(setup(tag).backgroundColor).to.equal('#d8d9d9')
    })

    it('yellow trello tags get a local gold color', () => {
      tag.color = 'yellow'

      expect(setup(tag).backgroundColor).to.equal('#866322')
    })

    it('black trello tags get a local slate grey color', () => {
      tag.color = 'black'

      expect(setup(tag).backgroundColor).to.equal('#60697c')
    })

    it('sky trello tags get a local dark purple  color', () => {
      tag.color = 'sky'

      expect(setup(tag).backgroundColor).to.equal('#5e3a46')
    })

    it('lime trello tags get a local fern green color', () => {
      tag.color = 'lime'

      expect(setup(tag).backgroundColor).to.equal('#596e4f')
    })

    it('red trello tags get a local dark pink color', () => {
      tag.color = 'red'

      expect(setup(tag).backgroundColor).to.equal('#a84769')
    })

    it('green trello tags get a local green color', () => {
      tag.color = 'green'

      expect(setup(tag).backgroundColor).to.equal('#3a7361')
    })

    it('orange trello tags get a local dark gold color', () => {
      tag.color = 'orange'

      expect(setup(tag).backgroundColor).to.equal('#78653a')
    })

    it('yellow pink tags get a local magenta color', () => {
      tag.color = 'pink'

      expect(setup(tag).backgroundColor).to.equal('#963958')
    })

    it('purple trello tags get a local purple color', () => {
      tag.color = 'purple'

      expect(setup(tag).backgroundColor).to.equal('#8655a0')
    })

    it('blue trello tags get a local blue color', () => {
      tag.color = 'blue'

      expect(setup(tag).backgroundColor).to.equal('#3e66b7')
    })
  })
})
