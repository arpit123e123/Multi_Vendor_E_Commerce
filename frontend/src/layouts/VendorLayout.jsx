import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/VendorSidebar";
import VendorNavbar from "../components/vendor/VendorNavbar";

function VendorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <VendorNavbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;