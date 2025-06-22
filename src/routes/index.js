// All components mapping with path for internal routes

import { lazy } from "react";

import FinanceAccounting from "../features/leads copy";
import BlogList from "../features/leads copy 8";
import EveryDayalegance from "../features/leads copy 5/index copy 3";
import Best from "../features/leads copy 5/index copy 4";
import Feature from "../features/leads copy 5/index copy 5";
import Instagram from "../features/leads copy 5/index copy 6";
import Testimonials from "../features/leads copy 5/index copy 7";
import Related from "../features/leads copy 5/index copy 9";
import About from "../features/leads copy 5/index copy 8";
import ShopDetail from "../features/leads copy 5/index copy 10";
import ContactUs from "../features/leads copy 5/index copy 11";
import AppScheme from "../features/leads copy 5/index copy 12";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));

const Products = lazy(() => import("../pages/protected/Product"));
const ViewProducts = lazy(() => import("../pages/protected/View"));
const OrderList = lazy(() => import("../pages/protected/Order"));
const Crousel = lazy(() => import("../pages/protected/Crousel"));
const Category = lazy(() => import("../pages/protected/Category"));
const Pricing = lazy(() => import("../pages/protected/Price"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/welcome", // the url
    component: Welcome, // view rendered
  },
  {
    path: "/Scheme", // the url
    component: AppScheme, // view rendered
  },

  {
    path: "/Products",
    component: Products,
  },
  {
    path: "/Crousel",
    component: Crousel,
  },
  {
    path: "/About",
    component: About,
  },
  {
    path: "/Everyday",
    component: EveryDayalegance,
  },
  {
    path: "/Related",
    component: Related,
  },
  {
    path: "/shopdetails",
    component: ShopDetail,
  },
  {
    path: "/best",
    component: Best,
  },
  {
    path: "/feature",
    component: Feature,
  },
  {
    path: "/instagram",
    component: Instagram,
  },
  {
    path: "/testimonials",
    component: Testimonials,
  },
  {
    path: "/contact",
    component: ContactUs,
  },

  {
    path: "/Category",
    component: Category,
  },
  {
    path: "/Price",
    component: Pricing,
  },
  {
    path: "/About",
    component: About,
  },
  {
    path: "/View",
    component: ViewProducts,
  },
  // {
  //   path: "/Edit",
  //   component: ViewProducts,
  // },

  {
    path: "/Users",
    component: FinanceAccounting,
  },
  {
    path: "/blogs",
    component: BlogList,
  },
  {
    path: "/Order",
    component: OrderList,
  },
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
];

export default routes;
