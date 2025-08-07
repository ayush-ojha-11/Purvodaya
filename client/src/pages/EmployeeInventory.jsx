/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useInventoryStore from "../store/useInventoryStore";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const EmployeeInventory = () => {
  const navigate = useNavigate();
  const {
    inventory,
    getInventory,
    submitInventoryRequest,
    isSubmitting,
    isLoading,
  } = useInventoryStore();

  const authUser = useAuthStore((state) => state.authUser);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [remainingStock, setRemainingStock] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  });

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItemId) return toast.error("Please select an inventory item");
    if (remainingStock === "")
      return toast.error("Field required to be filled");

    const payload = {
      type: "update",
      inventoryItem: selectedItemId,
      data: {
        remainingStock: Number(remainingStock),
      },
    };

    const result = await submitInventoryRequest(payload);

    if (result) {
      toast.success("Request submitted");
      setSelectedItemId("");
      remainingStock("");
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-bold mb-4">Inventory Update Request</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <div>
          <label className="font-semibold block mb-1">
            Select Inventory Item
          </label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Item --</option>
            {inventory.map((item) => (
              <option key={item._id} value={item._id}>
                {item.material} - {item.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Remaining stock</label>
          <input
            type="number"
            value={remainingStock}
            onChange={(e) => setRemainingStock(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Inventory Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>

        {isLoading ? (
          <p>Loading inventory...</p>
        ) : inventory.length === 0 ? (
          <p>No inventory items available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Material</th>
                  <th className="border px-4 py-2 text-left">Maker</th>
                  <th className="border px-4 py-2 text-left">Model</th>
                  <th className="border px-4 py-2 text-center">
                    Remaining Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.material}</td>
                    <td className="border px-4 py-2">{item.maker}</td>
                    <td className="border px-4 py-2">{item.model}</td>
                    <td className="border px-4 py-2 text-center">
                      {item.remainingStock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmployeeInventory;
