const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm md:max-w-md lg:max-w-lg p-6 rounded-lg shadow-xl">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Confirm Deletion
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-md hover:opacity-90  text-white dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#031741] text-white hover:bg-[#031748ec] transition"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
