/** Icons are imported separately to reduce build time */

import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import {
  MdCampaign,
  MdCategory,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { VscGitPullRequestNewChanges, VscFeedback } from "react-icons/vsc";
import {
  FaBookBookmark,
  FaAddressBook,
  FaEye,
  FaRegUser,
  FaUserAstronaut,
} from "react-icons/fa";

import { FcAbout } from "react-icons/fc";
const iconClasses = "h-5 w-5"; // Adjusted icon size for consistency

// Define routes for the sidebar with paths, icons, and names
const routes = [
  {
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },

  // {

  //   name: 'HomePage Management',
  // },

  // {
  //   path: '/app/About',
  //   icon: <FcAbout className={iconClasses} />,
  //   name: 'About',
  // },

  {
    name: "Category Management",
  },

  {
    path: "/app/Category",
    icon: <MdCategory className={iconClasses} />,
    name: "Category",
  },

  {
    name: "Price Management",
  },

  {
    path: "/app/Price",
    icon: <MdCategory className={iconClasses} />,
    name: "Price",
  },

  {
    name: "Product Management",
  },

  {
    path: "/app/Products",
    icon: <FaAddressBook className={iconClasses} />,
    name: "Add Products",
  },

  {
    path: "/app/View",
    icon: <FaAddressBook className={iconClasses} />,
    name: "View Products",
  },
  // {
  //   path: "/app/Edit",
  //   icon: <FaAddressBook className={iconClasses} />,
  //   name: "Edit Products",
  // },

  {
    name: "User Management",
  },
  {
    path: "/app/Users",
    icon: <FaUserAstronaut className={iconClasses} />,
    name: "Users",
  },
  {
    name: "Blog Management",
  },
  {
    path: "/app/blogs",
    icon: <FaUserAstronaut className={iconClasses} />,
    name: "Blogs",
  },
  {
    name: "Order Management",
  },
  {
    path: "/app/Order",
    icon: <FaUserAstronaut className={iconClasses} />,
    name: "View Order",
  },
  // // {

  //   name: 'Blog Management',
  // },
  // {
  //   path: '/app/Blog',
  //   icon: <FaUserAstronaut className={iconClasses} />,
  //   name: 'View Blog',
  // },
];

export default routes;
