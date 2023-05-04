import React from 'react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { cilAddressBook, cilCircle, cilUser } from '@coreui/icons/js/free'

const _nav = [
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'List',
        to: '/users/list',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Common codes',
    to: '/common-codes/tree',
    icon: <CIcon icon={cilCircle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tree',
        to: '/common-codes/tree',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Nested',
    to: '/nested-form/index',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'MainForm',
        to: '/nested-form/index',
      },
    ],
  },
]

export default _nav
