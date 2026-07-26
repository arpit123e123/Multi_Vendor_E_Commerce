import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/vendor/dashboard",
  },
  {
    name: "Products",
    icon: Package,
    path: "/vendor/products",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    path: "/vendor/orders",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/vendor/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/vendor/settings",
  },
];

function VendorSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md border-r min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Vendor Panel
        </h1>
      </div>

      <nav className="mt-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <button
          className="flex items-center gap-3 w-full px-6 py-3 mt-8 text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default VendorSidebar;