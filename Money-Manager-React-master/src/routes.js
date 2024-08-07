import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const InComes = React.lazy(() => import('./views/income/InCome'))
const Spendings = React.lazy(() => import('./views/spending/Spending'))
const Charts = React.lazy(() => import('./views/charts/Charts'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/income', name: 'Incomes', element: InComes },
  { path: '/spending', name: 'Spendings', element: Spendings },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
