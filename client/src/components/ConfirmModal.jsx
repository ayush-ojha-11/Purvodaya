const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure?",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with soft background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-base-100 p-6 rounded-lg w-[90%] max-w-sm shadow-xl border border-base-300">
        <h2 className="text-lg font-semibold text-error mb-2">
          Confirm Deletion
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error btn-sm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
