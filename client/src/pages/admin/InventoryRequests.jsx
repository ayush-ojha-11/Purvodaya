import { useEffect } from "react";
import useInventoryStore from "../../store/useInventoryStore";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const InventoryRequests = () => {
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

  const handleApprove = async (id) => {
    const success = await approveInventoryRequest(id);
    if (success) toast.success("Request approved");
  };

  const handleReject = async (id) => {
    const success = await rejectInventoryRequest(id);
    if (success) toast.success("Request rejected");
  };

  // Filter only pending requests
  const pendingRequests = inventoryRequests.filter(
    (req) => req.status === "pending"
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold text-primary">
        Inventory Requests
      </h2>

      {pendingRequests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Current Stock</th>
                <th className="px-4 py-2">Requested Change</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req, index) => (
                <tr key={req._id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {req.employee?.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {req.employee?.email}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium">
                      {req.inventoryItem?.material}
                    </div>
                    <div className="text-sm text-gray-500">
                      {req.inventoryItem?.maker} | {req.inventoryItem?.model}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {req.inventoryItem?.remainingStock ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    {req.data?.remainingStock ?? "-"}
                  </td>
                  <td className="px-4 py-2 capitalize">{req.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleApprove(req._id)}
                        title="Approve"
                      >
                        <CheckCircle
                          size={30}
                          className="text-green-600 hover:text-green-800"
                        />
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        title="Reject"
                      >
                        <XCircle
                          size={30}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>
                    </div>
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
