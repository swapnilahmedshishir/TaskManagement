import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  title,
  tasks,
  column,
  moveTask,
  onTaskClick,
  moveTaskWithinColumn,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.column !== column) {
        moveTask(draggedItem.id, draggedItem.column, column);
        draggedItem.column = column;
      }
    },
  });

  // Define title colors dynamically
  const titleColors = {
    "To-Do": "text-blue-600 dark:text-blue-400",
    InProgress: "text-yellow-600 dark:text-yellow-400",
    Done: "text-green-600 dark:text-green-400",
  };

  return (
    <div
      ref={drop}
      className={`flex flex-col w-full max-w-md p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg transition-all 
        ${isOver ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
      `}
    >
      {/* Column Title */}
      <h3
        className={`text-xl font-semibold mb-4 text-center uppercase tracking-wide 
          ${titleColors[title] || "text-gray-800 dark:text-white"}
        `}
      >
        {title}
      </h3>

      {/* Tasks List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks?.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              column={column}
              onTaskClick={onTaskClick}
              moveTaskWithinColumn={moveTaskWithinColumn}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No tasks here yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
