import '@testing-library/jest-dom'
import 'jsdom-global/register'
import React from 'react'
import Tree from './Tree'
import { shallow } from 'enzyme'
describe('Tree component', () => {
  it('validates model on button click', () => {
    const wrapper = shallow(<Tree />)
    const instance = wrapper.instance()

    //  const submitBtn = app.find('#sign-in')
    //  submitBtn.simulate('click')
    console.log(instance)
    // expect(instance).to.equal(null)
  })
})
