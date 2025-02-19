import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TopUp = () => {
  const [packages] = useState([
    {
      id: 1,
      amount: 100,
      bonus: 0,
      price: 100
    },
    {
      id: 2,
      amount: 300,
      bonus: 30,
      price: 300
    },
    {
      id: 3,
      amount: 500,
      bonus: 75,
      price: 500
    },
    {
      id: 4,
      amount: 1000,
      bonus: 200,
      price: 1000
    },
    {
      id: 5,
      amount: 2000,
      bonus: 500,
      price: 2000
    }
  ]);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [topUpCategory, setTopUpCategory] = useState('website'); // 'website' หรือ 'game'
  const [gameTopUpType, setGameTopUpType] = useState('money'); // 'money', 'gold', 'level', 'all'
  const [gameAccount, setGameAccount] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/users/balance', {
        headers: { Authorization: token }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleTopUp = async () => {
    if (!selectedPackage) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      if (topUpCategory === 'game' && (!gameAccount.username || !gameAccount.password)) {
        toast.error('กรุณากรอกข้อมูลบัญชีเกมให้ครบถ้วน');
        return;
      }

      const response = await axios.post('/api/payment/topup', {
        amount: selectedPackage.amount,
        packageId: selectedPackage.id,
        topUpCategory,
        gameTopUpType,
        gameAccount: topUpCategory === 'game' ? gameAccount : undefined
      }, {
        headers: { Authorization: token }
      });

      if (response.data.success) {
        toast.success('เติมเงินสำเร็จ');
        fetchBalance();
        setShowModal(false);
        setGameAccount({ username: '', password: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">เติมเข้าเกม</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <p className="text-gray-400 mb-2">ยอดเงินของเว็บ</p>
        <p className="text-3xl font-bold text-blue-500">${balance}</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${topUpCategory === 'website' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setTopUpCategory('website')}
          >
            🌐 เติมเงินเข้าเว็บไซต์
          </button>
          <button
            className={`px-4 py-2 rounded ${topUpCategory === 'game' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setTopUpCategory('game')}
          >
            🎮 เติมเกม
          </button>
        </div>

        {topUpCategory === 'game' && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                className={`p-3 rounded ${gameTopUpType === 'money' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setGameTopUpType('money')}
              >
                💰 เติมเงิน
              </button>
              <button
                className={`p-3 rounded ${gameTopUpType === 'gold' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setGameTopUpType('gold')}
              >
                🪙 เติมทอง
              </button>
              <button
                className={`p-3 rounded ${gameTopUpType === 'level' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setGameTopUpType('level')}
              >
                ⭐ เติมเลเวล
              </button>
              <button
                className={`p-3 rounded ${gameTopUpType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setGameTopUpType('all')}
              >
                🎁 เติมเงินและทองเลเวล
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อบัญชีในเกม"
                className="w-full p-3 rounded bg-gray-700 text-white"
                value={gameAccount.username}
                onChange={(e) => setGameAccount(prev => ({ ...prev, username: e.target.value }))}
              />
              <input
                type="password"
                placeholder="รหัสผ่านเกม"
                className="w-full p-3 rounded bg-gray-700 text-white"
                value={gameAccount.password}
                onChange={(e) => setGameAccount(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="text-2xl font-bold text-white mb-2">${pkg.amount}</div>
            {pkg.bonus > 0 && (
              <div className="text-sm text-green-400">+ โบนัส ${pkg.bonus}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          onClick={() => selectedPackage && setShowModal(true)}
          disabled={!selectedPackage}
        >
          💎 เติมเงิน
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">ยืนยันการเติมเงิน</h2>
            <p className="mb-4">คุณต้องการเติมเงิน ${selectedPackage.amount} ใช่หรือไม่?</p>
            {selectedPackage.bonus > 0 && (
              <p className="text-green-400 mb-4">รับโบนัส ${selectedPackage.bonus}</p>
            )}
            <div className="flex space-x-4">
              <button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleTopUp}
              >
                ยืนยัน
              </button>
              <button
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUp;
