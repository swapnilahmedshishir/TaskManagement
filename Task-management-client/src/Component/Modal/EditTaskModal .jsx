import { useState } from "react";

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [updatedDescription, setUpdatedDescription] = useState(
    task.description
  );

  const handleSave = () => {
    onSave(task._id, updatedTitle, updatedDescription);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
      <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Edit Task</h2>

        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Title"
          maxLength="50"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Description (optional)"
          maxLength="200"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
        />

        <div className="flex gap-4 mt-4">
          <button
            className="bg-[#031741] text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-blue-400 to-green-500 text-white px-4 py-2 rounded"
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
