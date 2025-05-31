import { useEffect, useState } from "react";
import useInventoryStore from "../store/useInventoryStore";
import toast from "react-hot-toast";

const InventoryFormModal = ({ isOpen, onClose, selectedItem }) => {
  const addInventoryItem = useInventoryStore((state) => state.addInventoryItem);
  const updateInventoryItem = useInventoryStore(
    (state) => state.updateInventoryItem
  );
  const isSubmitting = useInventoryStore((state) => state.isSubmitting);

  const [formData, setFormData] = useState({
    material: "",
    maker: "",
    model: "",
    remainingStock: 0,
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        material: selectedItem.material,
        maker: selectedItem.maker,
        model: selectedItem.model,
        remainingStock: selectedItem.remainingStock,
      });
    } else {
      setFormData({
        material: "",
        maker: "",
        model: "",
        remainingStock: "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = selectedItem
      ? await updateInventoryItem(selectedItem._id, formData)
      : await addInventoryItem(formData);

    if (success) {
      toast.success("Success");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          {selectedItem ? "Edit Inventory Item" : "Add Inventory Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="material"
              className="block text-sm font-medium text-gray-700"
            >
              Material
            </label>
            <input
              id="material"
              type="text"
              name="material"
              placeholder="Material"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.material}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="maker"
              className="block text-sm font-medium text-gray-700"
            >
              Maker
            </label>
            <input
              id="maker"
              type="text"
              name="maker"
              placeholder="Maker"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.maker}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <input
              id="model"
              type="text"
              name="model"
              placeholder="Model"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="remainingStock"
              className="block text-sm font-medium text-gray-700"
            >
              Total stock
            </label>
            <input
              id="remainingStock"
              type="number"
              name="remainingStock"
              placeholder="Total stock"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.remainingStock}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
              disabled={isSubmitting}
            >
              {selectedItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InventoryFormModal;
