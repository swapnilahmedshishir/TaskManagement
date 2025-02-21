import { useState, useEffect, useContext } from "react";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";
import Sidebar from "./Sidebar";
import TaskColumn from "./TaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../Context/ContextProvider";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";
import EditTaskModal from "../Modal/EditTaskModal ";

const TaskBoard = () => {
  const { user, logoutUser, apiUrl } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "todo",
  });

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        toast.success("Logged out successfully!");
      })
      .catch(() => {
        toast.error("Failed to log out. Please try again.");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiUrl}/tasksget`, {
        params: { userId: user?.uid },
      });

      const formattedTasks = { todo: [], inProgress: [], done: [] };

      // res.data.forEach((task) => {
      //   const categoryMap = {
      //     todo: "todo",
      //     inProgress: "inProgress",
      //     done: "done",
      //   };
      //   const mappedCategory = categoryMap[task.category];
      //   if (mappedCategory) {
      //     formattedTasks[mappedCategory].push(task);
      //   } else {
      //     console.warn("Unknown category:", task.category);
      //   }
      // });

      res.data.forEach((task) => {
        if (["todo", "inProgress", "done"].includes(task.category)) {
          formattedTasks[task.category].push(task);
        }
      });
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.title) return alert("Title is required!");

    const task = {
      ...newTask,
      userId: user?.uid,
    };

    const res = await axios.post(`${apiUrl}/addtasks`, task);
    setTasks((prev) => ({
      ...prev,
      [newTask.category]: [...prev[newTask?.category], res.data],
    }));
    setIsDialogOpen(false);
    setNewTask({ title: "", description: "", category: "todo" });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Open Delete Confirmation Modal
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${apiUrl}/tasks/${selectedTask._id}`);
      setTasks((prev) => ({
        ...prev,
        [selectedTask.category]: prev[selectedTask.category].filter(
          (t) => t._id !== selectedTask._id
        ),
      }));
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  // Open Edit Modal
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };
  // Close Edit Modal
  const handleEditSave = async () => {
    try {
      const updatedTask = {
        title: selectedTask.title,
        description: selectedTask.description,
      };
      await axios.put(`${apiUrl}/tasks/${selectedTask._id}`, updatedTask);

      setTasks((prev) => ({
        ...prev,
        [selectedTask.category]: prev[selectedTask.category].map((t) =>
          t._id === selectedTask._id ? { ...t, ...updatedTask } : t
        ),
      }));

      setSelectedTask(null);
      setIsEditModalOpen(false);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const moveTask = async (taskId, fromColumn, toColumn) => {
    const taskToMove = tasks[fromColumn].find((task) => task._id === taskId);
    if (!taskToMove) return;

    await axios.put(`${apiUrl}/tasks/${taskId}`, { category: toColumn });

    setTasks((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((task) => task._id !== taskId),
      [toColumn]: [...prev[toColumn], { ...taskToMove, category: toColumn }],
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 dark:text-white"
            >
              {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 mr-6 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Add Task
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-400 to-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {["todo", "inProgress", "done"].map((column) => (
              <TaskColumn
                key={column}
                title={column}
                tasks={tasks[column]}
                column={column}
                moveTask={moveTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </div>

        {/* Add Task Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-3">Add New Task</h2>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                placeholder="Title"
                maxLength="50"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Description (optional)"
                maxLength="200"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded mb-2"
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
              >
                <option value="To-Do">To-Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Show Dialog Box When Clicking a Task */}
        {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Task Options</h2>
              <p className="mb-4">{selectedTask.title}</p>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add/Edit Task Dialog */}
        {/* Edit Task Modal */}
        {isEditModalOpen && (
          <EditTaskModal
            task={selectedTask}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        {/* {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-lg font-bold mb-3">Edit Task</h2>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmDeleteModal
            onClose={() => setIsDeleteModalOpen(false)}
            // onConfirm={confirmDelete}
          />
        )}
        {/* {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <p className="mb-4">Are you sure you want to delete this task?</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
