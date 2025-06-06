import React from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";
import {
  BsGrid,
  BsHouse,
  BsPerson,
  BsCarFront,
  BsCashStack,
  BsGear,
  BsFileEarmarkText,
  BsBarChart,
  BsPeople,
  BsClipboardCheck,
} from "react-icons/bs";
import { LuCircleParking } from "react-icons/lu";

const menuItems = [
  {
    section: null,
    items: [{ icon: <BsGrid />, label: "Tổng quan", to: "/tong-quan" }],
  },
  {
    section: "Quản lý",
    items: [
      { icon: <BsHouse />, label: "Quản lý căn hộ", to: "/can-ho" },
      { icon: <BsPerson />, label: "Quản lý cư dân", to: "/cu-dan" },
      { icon: <BsCarFront />, label: "Quản lý xe cộ", to: "/xe-co" },
      { icon: <LuCircleParking />, label: "Quản lý chỗ đỗ xe", to: "/parking" },
    ],
  },
  {
    section: "Tài chính",
    items: [
      { icon: <BsCashStack />, label: "Phí và quỹ", to: "/phi-va-quy" },
      { icon: <BsBarChart />, label: "Thống kê", to: "/thong-ke" },
      { icon: <BsFileEarmarkText />, label: "Hóa đơn", to: "/hoa-don" },
    ],
  },
];

const SideBar = () => {
  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.section && (
            <div className="sidebar-section">{item.section}</div>
          )}
          {item.items.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <div className="sidebar-icon">{item.icon}</div>
              <div className="sidebar-text">{item.label}</div>
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SideBar;
