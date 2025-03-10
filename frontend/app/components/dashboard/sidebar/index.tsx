'use client';
import React, { useState, useEffect } from 'react';
import { FiHome, FiFileText, FiUsers, FiSettings, FiDollarSign, FiPieChart, FiLogOut, FiChevronDown, FiChevronUp, FiUserPlus, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAddChart, MdOutlineCategory, MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { TbFileInvoice, TbListDetails } from 'react-icons/tb';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';
import { LuLayoutTemplate, LuSquareUserRound } from 'react-icons/lu';
import { FaDotCircle, FaVoicemail } from 'react-icons/fa';
import { GoChecklist } from 'react-icons/go';
import { HiOutlineMail } from 'react-icons/hi';
import { IoDocumentsOutline, IoSettingsOutline } from 'react-icons/io5';
import { CiMoneyCheck1 } from 'react-icons/ci';

// Type definitions for menu items
interface SubMenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path?: string;
  subMenu?: SubMenuItem[];
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    {
      name: 'Administrator',
      icon: FiUsers,
      subMenu: [
        { name: 'Managers', icon: FiUserPlus, path: '/dashboard/administrator/managers' },
        { name: 'Users', icon: FiUser, path: '/dashboard/administrator/users' },
      ],
    },
    {
      name: 'Products',
      icon: MdOutlineProductionQuantityLimits,
      subMenu: [
        { name: "Product list", icon: TbListDetails, path: '/dashboard/products'},
        { name: "categories", icon: MdOutlineCategory, path: '/dashboard/products/categories'},
        { name: "units", icon: AiOutlineDeploymentUnit, path: '/dashboard/products/units'}
      ]
    },
    {
      name: "Customers",
      icon: LuSquareUserRound,
      path: "/dashboard/customers"
    },
    {
      name: "Invoices",
      icon: TbFileInvoice,
      subMenu: [
        { name: "add invoice", icon: MdAddChart, path: '/dashboard/invoices/add'},
        { name: "invoices list", icon: GoChecklist, path: '/dashboard/invoices'},
      ]
    },
    {
      name: "quotations",
      icon: IoDocumentsOutline,
      subMenu: [
        { name: "add quotation", icon: MdAddChart, path: '/dashboard/quotation/add'},
        { name: "quotation list", icon: GoChecklist, path: '/dashboard/quotation'},
      ]
    },
    {
      name: "transactions",
      icon: CiMoneyCheck1,
      path: "/dashboard/transactions"
    },
    {
      name: "templates",
      icon: LuLayoutTemplate,
      path: "/dashboard/templates"
    },
    {
      name: "Email Templates",
      icon: HiOutlineMail,
      path: '/dashboard/email_template'
    },
    {
      name: "Settings",
      icon: IoSettingsOutline,
      path: "/dashboard/Settings"
    }
  ];

  // Automatically open the submenu if the current path matches a submenu item
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subMenu) {
        const isSubMenuActive = item.subMenu.some((subItem) => pathname === subItem.path);
        if (isSubMenuActive) {
          setOpenMenu(item.name);
        }
      }
    });
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear auth token, redirect to login)
    router.push('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-white to-blue-50 shadow-xl border-r border-gray-100 flex flex-col">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TrackInvo
        </h1>
      </div>
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          if (item.subMenu) {
            const isOpen = openMenu === item.name;
            return (
              <div key={item.name}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setOpenMenu(isOpen ? null : item.name)}
                  className="flex items-center justify-between p-3 rounded-xl mb-2 transition-all hover:bg-white hover:shadow-md cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {item.name}
                    </span>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-8"
                    >
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-all ${
                            pathname === subItem.path
                              ? 'bg-blue-100 border-l-4 border-blue-600'
                              : 'hover:bg-gray-50 hover:border-l-4 hover:border-blue-200'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">{subItem.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
          return (
            <Link
              key={item.name}
              href={item.path!}
              className={`flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
                pathname === item.path
                  ? 'bg-blue-100 shadow-inner border-l-4 border-blue-600'
                  : 'hover:bg-white hover:shadow-md hover:border-l-4 hover:border-blue-200'
              }`}
            >
              <item.icon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;