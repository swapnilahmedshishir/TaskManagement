import { useState } from "react";

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [updatedTitle, setUpdatedTitle] = useState(task.title);

  const handleSave = () => {
    onSave(task._id, updatedTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Edit Task</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mt-2"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
        />
        <div className="flex gap-4 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
