import React, { useState } from 'react';
import toast from 'react-hot-toast';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    username: 'username',
    email: 'user@example.com',
    balance: 15000,
    cars: [
      { id: 1, name: 'Nissan Silvia S15', purchaseDate: '2024-02-15' }
    ],
    transactions: [
      { id: 1, type: 'topup', amount: 1000, date: '2024-02-14', status: 'success' },
      { id: 2, type: 'purchase', amount: -35000, date: '2024-02-15', status: 'success' }
    ]
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // TODO: เชื่อมต่อกับ API
      toast.success('อัพเดทโปรไฟล์สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gray-700 p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="/images/avatar-placeholder.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
                📷
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-gray-400">{profile.email}</p>
              <div className="mt-2 text-blue-500 font-semibold">
                ยอดเงินคงเหลือ: ฿{profile.balance.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              className={`px-6 py-3 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              โปรไฟล์
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === 'cars'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('cars')}
            >
              รถของฉัน
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              ประวัติธุรกรรม
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  value={profile.username}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">อีเมล</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </form>
          )}

          {activeTab === 'cars' && (
            <div className="space-y-6">
              {profile.cars.map(car => (
                <div key={car.id} className="bg-gray-700 p-6 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <p className="text-gray-400">ซื้อเมื่อ: {car.purchaseDate}</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                    ดูรายละเอียด
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {profile.transactions.map(transaction => (
                <div key={transaction.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {transaction.type === 'topup' ? 'เติมเงิน' : 'ซื้อรถ'}
                    </div>
                    <div className="text-gray-400">{transaction.date}</div>
                  </div>
                  <div className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}
                    ฿{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
