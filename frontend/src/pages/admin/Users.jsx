import { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/users");

      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleBlock = async (id, isBlocked) => {
    try {
      await api.patch(`/admin/users/${id}`, {
        isBlocked: !isBlocked,
      });

      toast.success(
        !isBlocked ? "User blocked successfully" : "User unblocked successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);

      toast.success("User deleted");

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>

        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full mb-6"
      />

      {loading ? (
        <div className="text-center py-10 text-lg">
          Loading...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Role</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user._id} className="border-t hover:bg-gray-50">

                  <td className="p-4">{user.name}</td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4 capitalize">{user.role}</td>

                  <td className="p-4">

                    {user.isBlocked ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Blocked
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    )}

                  </td>

                  <td className="p-4 flex gap-2 justify-center">

                    <button
                      onClick={() =>
                        handleBlock(user._id, user.isBlocked)
                      }
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Users;