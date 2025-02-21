import { useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";

const TaskCard = ({
  task,
  index,
  column,
  onTaskClick,
  moveTaskWithinColumn,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task?._id, column, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.column === column && draggedItem.index !== index) {
        moveTaskWithinColumn(column, draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // Define category colors
  const categoryColors = {
    "To-Do": "bg-blue-500",
    InProgress: "bg-yellow-500",
    Done: "bg-green-500",
  };

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`relative p-4 rounded-xl shadow-md bg-white dark:bg-gray-900 border 
        ${
          isDragging
            ? "opacity-50 scale-95"
            : "hover:shadow-lg transition-transform"
        } 
        cursor-pointer`}
      onClick={() => onTaskClick(task)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Category Indicator */}
      <div
        className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
          categoryColors[task?.category] || "bg-gray-400"
        }`}
      ></div>

      {/* Task Date */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(task?.timestamp))}
      </p>

      {/* Task Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {task?.title}
      </h3>

      {/* Task Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {task?.description}
      </p>

      {/* Priority Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`px-2 py-1 text-xs font-medium text-white rounded-md ${
            categoryColors[task?.category] || "bg-gray-500"
          }`}
        >
          {task?.category}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskCard;
