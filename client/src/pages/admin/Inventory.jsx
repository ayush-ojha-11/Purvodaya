import { useEffect, useState } from "react";

import useInventoryStore from "../../store/useInventoryStore.js";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import InventoryFormModal from "../../components/InventoryFormModal.jsx";
const InventoryPage = () => {
  const inventory = useInventoryStore((state) => state.inventory);
  const isLoading = useInventoryStore((state) => state.isLoading);
  const getInventory = useInventoryStore((state) => state.getInventory);
  const deleteInventoryItem = useInventoryStore(
    (state) => state.deleteInventoryItem
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    const success = await deleteInventoryItem(selectedItem._id);
    console.log(success);

    if (success) {
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary">Inventory</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        >
          + Add Items
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <p>Loading inventory...</p>
        ) : inventory.length === 0 ? (
          <p>No items found</p>
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Maker</th>
                <th>Model</th>
                <th>Qty Open</th>
                <th>Qty Close</th>
                <th>Remaining</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.material}</td>
                  <td>{item.maker}</td>
                  <td>{item.model}</td>
                  <td>{item.quantityOpen}</td>
                  <td>{item.quantityClose}</td>
                  <td>{item.remainingStock}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="btn btn-sm btn-ghost text-primary"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowFormModal(true);
                      }}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <InventoryFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${selectedItem?.material}"?`}
      />
    </div>
  );
};

export default InventoryPage;
