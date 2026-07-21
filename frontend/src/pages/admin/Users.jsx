import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {

      setLoading(true);

      const { data } = await api.get("/admin/users");

      setUsers(data.users || []);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch users"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          👥 Manage Users
        </h1>


        {loading ? (

          <p className="text-xl">
            Loading users...
          </p>

        ) : users.length === 0 ? (

          <div className="bg-white shadow rounded-xl p-10 text-center">
            No Users Found
          </div>

        ) : (

          <div className="bg-white shadow rounded-xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Role
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user)=>(

                  <tr
                    key={user._id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {user.name}
                    </td>


                    <td className="p-4">
                      {user.email}
                    </td>


                    <td className="p-4 capitalize">
                      {user.role}
                    </td>


                    <td className="p-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Users;