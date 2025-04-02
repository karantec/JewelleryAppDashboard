// All components mapping with path for internal routes

import { lazy } from 'react'

import FinanceAccounting from '../features/leads copy'
import BlogList from '../features/leads copy 8'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))

const Products = lazy(() => import('../pages/protected/Product'))
const ViewProducts=lazy(()=>import('../pages/protected/View'))

const Category=lazy(()=>import('../pages/protected/Category'))
const Pricing=lazy(()=>import('../pages/protected/Price'))
const About=lazy(()=>import('../pages/protected/About'));

const routes = [
  {
    path: '/dashboard', // the url
  component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/Products',
    component: Products,
  },
  {
    path: '/Category',
    component: Category,
  },
  {
    path: '/Price',
    component: Pricing,
  },
  {
    path: '/About',
    component: About,
  },
  {

    path: '/View',
    component: ViewProducts,
  },
  // {

  //   path: '/edit-product/:id',
  //   component: EditProducts,
  // },
  {
    path: '/Users',
    component: FinanceAccounting,
  },
  {
    path: '/blogs',
    component: BlogList,
  },
  // {
    
  //   path: '/Order',
  //   component: OrderList,
  // },
  // {
    
  //   path: '/Blog',
  //   component: ViewBlog,
  // },
  // {
  //   path: '/troubleshoot',
  //   component: TroubleShoot,
  // },
  // {
  //   path: '/callback',
  //   component: CallBackRequest,
  // },
  // {
  //   path: '/RequestDemo',
  //   component: RequestDemo,
  // },
  // {
  //   path: '/BookDemo',
  //   component: BookDemo,
  // },
  // {
  //   path: '/Feedback',
  //   component: Feedback,
  // },
  // {
  //   path: '/settings-team',
  //   component: Team,
  // },
  // {
  //   path: '/calendar',
  //   component: Calendar,
  // },
  // {
  //   path: '/transactions',
  //   component: Transactions,
  // },
  // {
  //   path: '/Register',
  //   component: Registration,
  // },
  // {
  //   path: '/Manual',
  //   component: Manual,
  // },
  // {
  //   path: '/EditProfile',
  //   component: EditProfile,
  // },
  // {
  //   path:'/ChangePassword',
  //   component:ChangePassword,
  // },

  // {
  //   path: '/Address',
  //   component: Address,
  // },
  // {
  //   path: '/settings-billing',
  //   component: Bills,
  // },
  // {
  //   path: '/getting-started',
  //   component: GettingStarted,
  // },
  // {
  //   path: '/PrivacyPolicy',
  //   component: PrivacyPolicy,
  // },
  // {
  //   path: '/Faq',
  //   component: FAQPage,
  // },
  // {
  //   path: '/termofservice',
  //   component:TermofServie ,
  // },
  // {
  //   path: '/features',
  //   component: DocFeatures,
  // },
  // {
  //   path: '/components',
  //   component: DocComponents,
  // },
  // {
  //   path: '/integration',
  //   component: Integration,
  // },
  // {
  //   path: '/charts',
  //   component: Charts,
  // },
  // {
  //   path: '/404',
  //   component: Page404,
  // },
  // {
  //   path: '/blank',
  //   component: Blank,
  // },
]

export default routes
