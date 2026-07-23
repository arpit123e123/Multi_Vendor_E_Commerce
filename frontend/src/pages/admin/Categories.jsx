import { useEffect, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/categories");

      setCategories(data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      await api.post("/categories", {
        name,
      });

      toast.success("Category added");

      setName("");

      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category deleted");

      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>

        <button
          onClick={fetchCategories}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Category name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <button
          onClick={addCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          No Categories Found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="p-4 font-medium">{category.name}</td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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

export default Categories;
