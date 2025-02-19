import React from 'react';
import { Link } from 'react-router-dom';

function Admin() {
  const adminMenus = [
    {
      title: 'จัดการหมวดหมู่',
      description: 'จัดการหมวดหมู่สินค้า, ประเภทการเติมเงิน และการเคลม',
      path: '/admin/categories',
      icon: '📑'
    },
    {
      title: 'จัดการการเคลม',
      description: 'ตรวจสอบและจัดการคำขอเคลมจากผู้ใช้',
      path: '/admin/claims',
      icon: '🔄'
    },
    {
      title: 'จัดการผู้ใช้',
      description: 'ดูข้อมูลและจัดการบัญชีผู้ใช้',
      path: '/admin/users',
      icon: '👥'
    },
    {
      title: 'รายงาน',
      description: 'ดูรายงานการขาย, การเติมเงิน และสถิติต่างๆ',
      path: '/admin/reports',
      icon: '📊'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">แผงควบคุมผู้ดูแลระบบ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminMenus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition group"
            >
              <div className="text-3xl mb-4">{menu.icon}</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400">
                {menu.title}
              </h3>
              <p className="text-gray-400">{menu.description}</p>
            </Link>
          ))}
        </div>

        {/* สถิติโดยรวม */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">ผู้ใช้ทั้งหมด</div>
            <div className="text-2xl font-bold">1,234</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">การเคลมที่รอดำเนินการ</div>
            <div className="text-2xl font-bold">5</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">ยอดขายวันนี้</div>
            <div className="text-2xl font-bold">฿45,678</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
