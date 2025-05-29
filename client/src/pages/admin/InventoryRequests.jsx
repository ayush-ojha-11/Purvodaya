import { useEffect } from "react";
import useInventoryStore from "../../store/useInventoryStore";
import { CheckCircle, XCircle } from "lucide-react";

const InventoryRequests = () => {
  // Subscribing to store functions
  const inventoryRequests = useInventoryStore(
    (state) => state.inventoryRequests
  );
  const getInventoryRequests = useInventoryStore(
    (state) => state.getInventoryRequests
  );
  const approveInventoryRequest = useInventoryStore(
    (state) => state.approveInventoryRequest
  );
  const rejectInventoryRequest = useInventoryStore(
    (state) => state.rejectInventoryRequest
  );

  useEffect(() => {
    getInventoryRequests();
  }, [getInventoryRequests]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl text-primary font-semibold">
        Inventory Requests
      </h2>
      {inventoryRequests?.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Item</th>
                <th>Current</th>
                <th>Requested</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRequests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>
                    {req.employee.name} <br />
                    <span className="text-xs text-gray-500">
                      {req.employee.email}
                    </span>
                  </td>
                  <td>
                    Open: {req.data.quantityOpen}
                    <br />
                    Close: {req.data.quantityClose}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        req.status === "pending"
                          ? "badge-warning"
                          : req.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="flex gap-2 justify-center">
                    {req.status === "pending" && (
                      <>
                        <button>
                          <CheckCircle size={18} />
                        </button>

                        <button>
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {req.status !== "pending" && <span>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryRequests;
