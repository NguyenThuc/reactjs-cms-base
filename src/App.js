import React, { useCallback, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import './scss/style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './actions/auth'
import AuthExpireVerify from './common/security/AuthExpireVerify'
import { clearMessage } from './actions/message'
import EventBus from './common/security/EventBus'
import AuthStorageVerify from './common/security/AuthStorageVerify'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const useLocationChange = (callback) => {
  let location = useLocation()

  useEffect(() => {
    callback(clearMessage()) // clear message when changing location
  }, [location, callback])
}

const App = () => {
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state) => state.userReducer.auth)

  useLocationChange(dispatch)

  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  useEffect(() => {
    EventBus.on('logout', () => {
      logOut()
    })

    return () => {
      EventBus.remove('logout')
    }
  }, [currentUser, logOut])

  return (
    <React.Suspense fallback={loading}>
      <Switch>
        <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
        <Route
          exact
          path="/register"
          name="Register Page"
          render={(props) => <Register {...props} />}
        />
        <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
        <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
        <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
      </Switch>
      <AuthExpireVerify logOut={logOut} />
      <AuthStorageVerify />
    </React.Suspense>
  )
}

export default App
