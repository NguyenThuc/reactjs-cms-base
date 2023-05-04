import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter } from 'react-router-dom'
import { unregister } from './serviceWorker'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ModalConfirmProvider } from './common/context/ModalConfirmContext'

ReactDOM.render(
  <Provider store={store}>
    <ModalConfirmProvider>
      <BrowserRouter basename="/cms">
        <App />
        <ToastContainer />
      </BrowserRouter>
    </ModalConfirmProvider>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister()
