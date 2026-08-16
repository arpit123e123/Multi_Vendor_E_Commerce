import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Settings,
  Store,
  Package,
  FolderOpen,
  ShoppingCart,
  TicketPercent,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice";

const menus = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Vendors",
    path: "/admin/vendors",
    icon: Store,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: FolderOpen,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Coupons",
    path: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-[#111827] text-white flex flex-col border-r border-gray-800">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">ShopHub</h1>

            <p className="text-[11px] text-gray-400 uppercase tracking-wider">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-6 flex-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Management
        </p>

        <nav className="space-y-1">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-300"
                      }
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Logout */}
      <div className="p-3 border-t border-gray-800">
        <div className="px-3 py-3 mb-2 rounded-lg bg-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "Administrator"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Admin account"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
