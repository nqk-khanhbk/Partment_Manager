import React from 'react';
import './sidebar.css'
import { NavLink } from 'react-router-dom';
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
  BsClipboardCheck
} from 'react-icons/bs';

const menuItems = [
  {
    section: null,
    items: [
      { icon: <BsGrid />, label: 'Tổng quan', to: '/tong-quan' }
    ]
  },
  {
    section: 'Quản lý',
    items: [
      { icon: <BsHouse />, label: 'Quản lý căn hộ', to: '/can-ho' },
      { icon: <BsPerson />, label: 'Quản lý cư dân',  to: '/cu-dan'  },
      { icon: <BsCarFront />, label: 'Quản lý xe cộ',to: '/xe-co' }
    ]
  },
  {
    section: 'Tài chính',
    items: [
      { icon: <BsCashStack />, label: 'Phí và quỹ', to: '/phi-va-quy' },
      { icon: <BsBarChart />, label: 'Thống kê', to: '/thong-ke' },
      { icon: <BsFileEarmarkText />, label: 'Hóa đơn', to: '/hoa-don' }
    ]
  },
  {
    section: 'Quản lý hệ thống',
    items: [
      { icon: <BsGear />, label: 'Cấu hình', to: '/cau-hinh' },
      { icon: <BsFileEarmarkText />, label: 'Báo cáo', to: '/bao-cao' }
    ]
  },
  {
    section: 'Cài đặt',
    items: [
      { icon: <BsPeople />, label: 'Người dùng', to: '/nguoi-dung' },
      { icon: <BsClipboardCheck />, label: 'Vai trò', to: '/vai-tro' }
    ]
  }
];

const SideBar = () => {
  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.section && <div className="sidebar-section">{item.section}</div>}
          {item.items.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="sidebar-icon">{item.icon}</div>
              <div className='sidebar-text'>{item.label}</div>
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SideBar;
