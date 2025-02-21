import { useState, useEffect, useContext } from "react";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";
import { Plus } from "lucide-react";
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
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      res.data.forEach((task) => {
        const categoryMap = {
          todo: "todo",
          inProgress: "inProgress",
          done: "done",
        };
        const mappedCategory = categoryMap[task.category];
        if (mappedCategory) {
          formattedTasks[mappedCategory].push(task);
        } else {
          console.warn("Unknown category:", task.category);
        }
      });

      // res.data.forEach((task) => {
      //   if (["todo", "inProgress", "done"].includes(task.category)) {
      //     formattedTasks[task.category].push(task);
      //   }
      // });
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
    toast.success("Task add successfully!");
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
  //  Edit Modal

  const handleEditSave = async (taskId, updatedTitle, updatedDescription) => {
    try {
      const updatedTask = {};

      // Only add fields that were changed
      if (updatedTitle !== selectedTask.title) {
        updatedTask.title = updatedTitle;
      }
      if (updatedDescription !== selectedTask.description) {
        updatedTask.description = updatedDescription;
      }

      // If nothing changed, do not send the request
      if (Object.keys(updatedTask).length === 0) {
        toast.info("No changes made.");
        setIsEditModalOpen(false);
        return;
      }

      await axios.put(`${apiUrl}/tasks/${taskId}`, updatedTask);

      setTasks((prev) => ({
        ...prev,
        [selectedTask.category]: prev[selectedTask.category].map((t) =>
          t._id === taskId ? { ...t, ...updatedTask } : t
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
    const taskToMove = tasks[fromColumn]?.find((task) => task._id === taskId);

    if (!taskToMove) {
      console.error("Error: Task not found in fromColumn", {
        taskId,
        fromColumn,
      });
      return;
    }

    try {
      await axios.put(`${apiUrl}/tasks/${taskId}`, { category: toColumn });

      setTasks((prev) => {
        const updatedTasks = { ...prev };
        updatedTasks[fromColumn] = updatedTasks[fromColumn].filter(
          (task) => task._id !== taskId
        );
        updatedTasks[toColumn] = [
          ...updatedTasks[toColumn],
          { ...taskToMove, category: toColumn },
        ];
        toast.success("task move successfully!");
        return updatedTasks;
      });
    } catch (error) {
      console.error(
        "Error moving task:",
        error.response?.data || error.message
      );
    }
  };

  const moveTaskWithinColumn = async (column, fromIndex, toIndex) => {
    let movedTask;

    setTasks((prev) => {
      const updatedColumn = [...prev[column]];
      movedTask = updatedColumn[fromIndex];

      updatedColumn.splice(fromIndex, 1);
      updatedColumn.splice(toIndex, 0, movedTask);

      // Update order values
      updatedColumn.forEach((task, index) => {
        task.order = index + 1;
      });

      return { ...prev, [column]: updatedColumn };
    });

    if (!movedTask) return;

    try {
      await axios.put(`${apiUrl}/tasks/${tasks[column][fromIndex]._id}`, {
        order: tasks[column][fromIndex].order,
      });
    } catch (error) {
      console.error("Error updating task order:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Main Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 dark:text-white text-2xl"
              >
                <FaBars />
              </button>
              <h1 className="text-xl font-semibold dark:text-white pl-4">
                Welcome to Task Manager
              </h1>
            </div>
            <div className="flex justify-between items-center ">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#031741] hover:bg-[#031748ec] mr-6 text-white px-5 py-2.5 rounded-lg flex items-center shadow-lg transition-all duration-300"
              >
                <Plus className="mr-2" size={20} /> Add Task
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-400 to-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                Logout
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
                moveTaskWithinColumn={moveTaskWithinColumn}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm md:max-w-md lg:max-w-lg p-6 rounded-lg shadow-xl relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>

              {/* Dialog Title */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Task Options
              </h2>

              {/* Task Details */}
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {selectedTask.title}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition"
                  // onClick={onEdit}
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-lg  bg-[#031741] text-white hover:bg-[#031748ec] transition"
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
            onSave={handleEditSave}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmDeleteModal
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
