import React, { useState } from 'react';
import toast from 'react-hot-toast';

const initialCategories = [
  { id: 1, name: 'รถยนต์', type: 'car' },
  { id: 2, name: 'ไอดีพร้อมเล่น', type: 'ready_account' },
  { id: 3, name: 'เติมเงิน', type: 'topup' },
  { id: 4, name: 'เคลมสินค้า', type: 'claim' }
];

function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState({ name: '', type: '' });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.type) {
      toast.error('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    setCategories([...categories, { ...newCategory, id: Date.now() }]);
    setNewCategory({ name: '', type: '' });
    toast.success('เพิ่มหมวดหมู่สำเร็จ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">จัดการหมวดหมู่</h2>

      {/* เพิ่มหมวดหมู่ใหม่ */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">เพิ่มหมวดหมู่ใหม่</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="ชื่อหมวดหมู่"
            className="px-4 py-2 bg-gray-700 rounded-lg"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <select
            className="px-4 py-2 bg-gray-700 rounded-lg"
            value={newCategory.type}
            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
          >
            <option value="">เลือกประเภท</option>
            <option value="car">รถยนต์</option>
            <option value="ready_account">ไอดีพร้อมเล่น</option>
            <option value="topup">เติมเงิน</option>
            <option value="claim">เคลมสินค้า</option>
          </select>
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
          >
            เพิ่มหมวดหมู่
          </button>
        </div>
      </div>

      {/* รายการหมวดหมู่ */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">รายการหมวดหมู่ทั้งหมด</h3>
        <div className="grid gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div>
                <h4 className="font-semibold">{category.name}</h4>
                <p className="text-gray-400">ประเภท: {category.type}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition">
                  แก้ไข
                </button>
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition">
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
