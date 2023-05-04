import React from 'react'
import {
  P_COMMON_CODES,
  P_COMMON_CODES_TREE,
  P_DASHBOARD,
  P_HOME,
  P_USERS,
  P_USERS_ADD,
  P_USERS_EDIT,
  P_USERS_LIST,
  P_USERS_VIEW,
  P_WIDGETS,
} from './constant'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Widgets = React.lazy(() => import('./views/components/widgets/Widgets'))
const UserList = React.lazy(() => import('./views/components/users/List'))
const UserAdd = React.lazy(() => import('./views/components/users/Add'))
const UserEdit = React.lazy(() => import('./views/components/users/Edit'))
const UserView = React.lazy(() => import('./views/components/users/View'))
const commonCodes = React.lazy(() => import('./views/components/common-codes/Tree'))
const nestedForm = React.lazy(() => import('./views/components/nested-form/NestedForm'))
const routes = [
  { path: P_HOME, exact: true, name: 'Home' },
  { path: P_DASHBOARD, name: 'Dashboard', component: Dashboard },
  { path: P_WIDGETS, name: 'Widgets', component: Widgets },
  { path: P_USERS, name: 'User', exact: true, component: UserList },
  { path: P_USERS_LIST, name: 'List', component: UserList },
  { path: P_USERS_ADD, name: 'Add', component: UserAdd },
  { path: P_USERS_EDIT, name: 'Edit', component: UserEdit },
  { path: P_USERS_VIEW, name: 'View', component: UserView },
  { path: P_COMMON_CODES, name: 'commonCodes', exact: true, component: commonCodes },
  { path: P_COMMON_CODES_TREE, name: 'Tree', component: commonCodes },
  { path: '/nested-form', name: 'nestedForm', exact: true, component: nestedForm },
  { path: '/nested-form/index', name: 'MainForm', component: nestedForm },
]

export default routes
