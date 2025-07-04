/** Icons are imported separately to reduce build time */

import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import { MdCategory } from "react-icons/md";

import { FaAddressBook, FaUserAstronaut } from "react-icons/fa";

const iconClasses = "h-5 w-5"; // Adjusted icon size for consistency

// Define routes for the sidebar with paths, icons, and names
const routes = [
  {
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    name: "HomePage Management",
  },
  {
    path: "/app/Scheme",
    icon: <MdCategory className={iconClasses} />,
    name: "AppScheme",
  },
  {
    path: "/app/Crousel",
    icon: <MdCategory className={iconClasses} />,
    name: "Crousel",
  },
  {
    path: "/app/About",
    icon: <MdCategory className={iconClasses} />,
    name: "About",
  },
  {
    path: "/app/EveryDay",
    icon: <MdCategory className={iconClasses} />,
    name: "EveryDay Elegance",
  },
  {
    path: "/app/Related",
    icon: <MdCategory className={iconClasses} />,
    name: "Related Products",
  },
  {
    path: "/app/contact",
    icon: <MdCategory className={iconClasses} />,
    name: "Contact",
  },
  {
    path: "/app/shopdetails",
    icon: <MdCategory className={iconClasses} />,
    name: "Shop details",
  },

  {
    path: "/app/best",
    icon: <MdCategory className={iconClasses} />,
    name: "Best",
  },
  {
    path: "/app/feature",
    icon: <MdCategory className={iconClasses} />,
    name: "Feature",
  },
  {
    path: "/app/instagram",
    icon: <MdCategory className={iconClasses} />,
    name: "Instagram",
  },
  {
    path: "/app/testimonials",
    icon: <MdCategory className={iconClasses} />,
    name: "Testimonials",
  },
  {
    path: "/app/instagram",
    icon: <MdCategory className={iconClasses} />,
    name: "Instagram",
  },
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
