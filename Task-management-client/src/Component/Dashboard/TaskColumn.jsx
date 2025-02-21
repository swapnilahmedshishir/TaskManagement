import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, tasks, column, moveTask, onTaskClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, item.column, column),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow ${
        isOver ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {title}
      </h3>
      <div className="space-y-3">
        {tasks?.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            column={column}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
