import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Users, X } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? "0%" : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-5 shadow-xl z-50"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-wide">Task Manager</h2>
        <X
          className="cursor-pointer text-xl hover:bg-gradient-to-r from-blue-400 to-green-500"
          onClick={onClose}
        />
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-4">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={22} />}
            label="Dashboard"
          />
          <NavItem
            to="/projects"
            icon={<FolderKanban size={22} />}
            label="Projects"
          />
          <NavItem to="/team" icon={<Users size={22} />} label="Team" />
        </ul>
      </nav>
    </motion.div>
  );
};

/* Updated NavItem Component with NavLink */
const NavItem = ({ to, icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${
          isActive ? "bg-[#1e40af] text-white" : "hover:bg-[#334155]"
        }`
      }
    >
      {icon}
      <span className="text-lg font-medium">{label}</span>
    </NavLink>
  </li>
);

export default Sidebar;
