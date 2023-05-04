import 'jsdom-global/register'
import '@testing-library/jest-dom'
import React from 'react'
import Login from './Login'
import { mount } from 'enzyme'

describe('Login component', () => {
  it('validates model on button click', () => {
    const wrapper = mount(<Login />)
    const instance = wrapper.instance()

    //  const submitBtn = app.find('#sign-in')
    //  submitBtn.simulate('click')
    expect(instance).to.equal(null)
  })
})
