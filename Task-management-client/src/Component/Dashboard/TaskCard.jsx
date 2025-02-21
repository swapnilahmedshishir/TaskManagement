import { useDrag } from "react-dnd";

const TaskCard = ({ task, column, onTaskClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task?._id, column },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onTaskClick(task)}
    >
      <p className="text-gray-800 dark:text-white">{task?.title}</p>
    </div>
  );
};

export default TaskCard;
