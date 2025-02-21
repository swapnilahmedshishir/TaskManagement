import { FaTimes } from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Manager</h2>
        <FaTimes className="cursor-pointer" onClick={onClose} />
      </div>
      <nav>
        <ul className="space-y-3">
          <li className="hover:bg-gray-700 p-2 rounded">Dashboard</li>
          <li className="hover:bg-gray-700 p-2 rounded">Projects</li>
          <li className="hover:bg-gray-700 p-2 rounded">Team</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
