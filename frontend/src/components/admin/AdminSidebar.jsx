import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "👥",
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: "⚙️",
  },
  {
    name: "Vendors",
    path: "/admin/vendors",
    icon: "🏪",
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: "📦",
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: "📂",
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: "🛒",
  },
  {
    name: "Coupons",
    path: "/admin/coupons",
    icon: "🎟️",
  },
];

function AdminSidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen shadow-xl">

      <div className="text-2xl font-bold text-center py-8 border-b border-slate-700">
        ADMIN PANEL
      </div>

      <nav className="mt-6 flex flex-col">

        {menus.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `px-6 py-4 text-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            <span className="mr-3">
              {item.icon}
            </span>

            {item.name}

          </NavLink>

        ))}

      </nav>

      <button className="flex items-center gap-3 text-red-400 hover:text-red-300 px-6 py-5 mt-auto">
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;