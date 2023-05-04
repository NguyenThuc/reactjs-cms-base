import React from 'react'
import { shallow } from 'enzyme'
import App1 from './App1'

describe('App component', () => {
  it('starts with a count of 0', () => {
    const wrapper = shallow(<App1 />)
    const text = wrapper.find('div.counter-value').text()
    expect(text).toEqual('Count: 0')
  })
  it('increments count by 1 when the increment button is clicked', () => {
    const wrapper = shallow(<App1 />)
    const incrementBtn = wrapper.find('button.increment')
    incrementBtn.simulate('click')
    const text = wrapper.find('div.counter-value').text()
    expect(text).toEqual('Count: 1')
  })
})
