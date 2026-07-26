import { Bell, Search, UserCircle } from "lucide-react";

function VendorNavbar() {
  return (
    <header className="h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={22} />
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle size={36} className="text-blue-600" />
          <div>
            <p className="font-semibold">Vendor</p>
            <p className="text-xs text-gray-500">
              vendor@gmail.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default VendorNavbar;