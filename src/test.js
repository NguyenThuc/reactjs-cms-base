
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
    
describe('App component', () => {
  //Test 1: Ví dụ test quản lý state cơ bản
  it('starts with a count of 0', () => {
    const wrapper = shallow(<App />);
    const text = wrapper.find('div.counter-value').text();
    expect(text).toEqual('Count: 0');
  });
  //Test 2: Ví dụ test tương tác của người dùng
  it('increments count by 1 when the increment button is clicked', () => {
    const wrapper = shallow(<App />);
    const incrementBtn = wrapper.find('button.increment');
    incrementBtn.simulate('click');
    const text = wrapper.find('div.counter-value').text();
    expect(text).toEqual('Count: 1');
  });