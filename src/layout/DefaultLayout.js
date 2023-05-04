import React from 'react'
import { AppContent, AppFooter, AppHeader, AppSidebar } from '../components/index'
import { Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'

const DefaultLayout = () => {
  const location = useLocation()
  const currentRoute = routes.find((route) => route.path === location.pathname)
  if (currentRoute === null || currentRoute === undefined) {
    return <Redirect to="/404" />
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
