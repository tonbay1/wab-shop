import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

const topUpTypes = [
  { id: 'money', name: 'เติมเงิน', icon: '💰', unit: '฿' },
  { id: 'gold', name: 'เติมทอง', icon: '🌟', unit: 'ทอง' }
];

const topUpOptions = {
  money: [
    { amount: 100, bonus: 0, price: 100 },
    { amount: 300, bonus: 30, price: 300 },
    { amount: 500, bonus: 75, price: 500 },
    { amount: 1000, bonus: 200, price: 1000 },
    { amount: 2000, bonus: 500, price: 2000 },
  ],
  gold: [
    { amount: 100, bonus: 0, price: 30 },
    { amount: 500, bonus: 50, price: 140 },
    { amount: 1000, bonus: 150, price: 280 },
    { amount: 2000, bonus: 400, price: 550 },
    { amount: 5000, bonus: 1250, price: 1350 },
  ]
};

function TopUp() {
  const [selectedType, setSelectedType] = useState('money');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [gameEmail, setGameEmail] = useState('');
  const [gamePassword, setGamePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // โหลดยอดเงินคงเหลือ
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/user/balance');
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };
    fetchBalance();
  }, []);

  const handleSelectOption = (option) => {
    setSelectedAmount(option.amount);
    setCustomAmount('');
    setSelectedOption(option);
  };

  const handleOpenConfirm = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount) {
      toast.error('กรุณาเลือกจำนวน');
      return;
    }

    if (!gameEmail || !gamePassword) {
      toast.error('กรุณากรอกอีเมลและรหัสผ่านของเกม');
      return;
    }

    // หาราคาสำหรับจำนวนที่กำหนดเอง
    let price = amount;
    if (selectedType === 'gold') {
      price = Math.ceil(amount * 0.27); // คำนวณราคาตามอัตราส่วน
    }

    setSelectedOption({
      amount: amount,
      price: price,
      bonus: 0
    });
    setIsConfirmOpen(true);
  };

  const handleTopUp = async () => {
    if (!selectedOption) return;

    if (selectedOption.price > balance) {
      toast.error('ยอดเงินคงเหลือไม่เพียงพอ');
      setIsConfirmOpen(false);
      return;
    }

    setLoading(true);
    try {
      // หักเงินจากบัญชี
      await axios.post('/api/payment/deduct', {
        amount: selectedOption.price
      });

      // เติมเข้าเกม
      const response = await axios.post('https://game-api.example.com/topup', {
        email: gameEmail,
        password: gamePassword,
        type: selectedType,
        amount: selectedOption.amount
      });

      if (response.data.success) {
        toast.success(`เติม${selectedType === 'money' ? 'เงิน' : 'ทอง'}สำเร็จ`);
        setGameEmail('');
        setGamePassword('');
        setSelectedAmount(null);
        setCustomAmount('');
        setBalance(prev => prev - selectedOption.price);
      } else {
        // คืนเงินกรณีเติมไม่สำเร็จ
        await axios.post('/api/payment/refund', {
          amount: selectedOption.price
        });
        toast.error(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      // คืนเงินกรณีเกิดข้อผิดพลาด
      await axios.post('/api/payment/refund', {
        amount: selectedOption.price
      });
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      console.error('TopUp Error:', error);
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">เติมเข้าเกม</h2>

        {/* ยอดเงินคงเหลือ */}
        <div className="bg-gray-700 p-6 rounded-lg mb-8">
          <div className="text-gray-400 mb-2">ยอดเงินคงเหลือ</div>
          <div className="text-3xl font-bold text-blue-500">฿{balance.toLocaleString()}</div>
        </div>

        {/* เลือกประเภทการเติม */}
        <div className="flex space-x-4 mb-8">
          {topUpTypes.map(type => (
            <button
              key={type.id}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* ข้อมูลบัญชีเกม */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-300 mb-2">อีเมลบัญชีเกม</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกอีเมลที่ใช้ในเกม"
              value={gameEmail}
              onChange={(e) => setGameEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">รหัสผ่านเกม</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกรหัสผ่านที่ใช้ในเกม"
              value={gamePassword}
              onChange={(e) => setGamePassword(e.target.value)}
            />
          </div>
        </div>

        {/* ตัวเลือกการเติม */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topUpOptions[selectedType].map((option) => (
            <button
              key={option.amount}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAmount === option.amount
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 hover:border-blue-500'
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <div className="text-xl font-bold mb-2">
                {selectedType === 'money' ? '฿' : '🌟'}{option.amount.toLocaleString()}
              </div>
              {option.bonus > 0 && (
                <div className="text-green-500 text-sm">
                  + โบนัส {selectedType === 'money' ? '฿' : '🌟'}{option.bonus.toLocaleString()}
                </div>
              )}
              {selectedType === 'gold' && (
                <div className="text-gray-400 text-sm mt-2">
                  ราคา ฿{option.price.toLocaleString()}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* จำนวนที่ต้องการเติม */}
        <div className="mb-8">
          <label className="block text-gray-300 mb-2">หรือระบุจำนวนที่ต้องการเติม</label>
          <div className="flex space-x-4">
            <input
              type="number"
              min="1"
              placeholder={`ระบุจำนวน${selectedType === 'money' ? 'เงิน' : 'ทอง'}`}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
            <button
              onClick={handleOpenConfirm}
              disabled={loading}
              className={`px-8 py-2 rounded-lg transition ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'กำลังดำเนินการ...' : `เติม${selectedType === 'money' ? 'เงิน' : 'ทอง'}`}
            </button>
          </div>
          {selectedType === 'gold' && customAmount && (
            <div className="text-gray-400 text-sm mt-2">
              ราคาประมาณ ฿{Math.ceil(parseInt(customAmount) * 0.27).toLocaleString()}
            </div>
          )}
        </div>

        {/* คำเตือน */}
        <div className="bg-yellow-500/20 border border-yellow-500 p-4 rounded-lg">
          <h3 className="text-yellow-500 font-semibold mb-2">คำเตือน</h3>
          <ul className="text-yellow-400/80 text-sm space-y-1">
            <li>• กรุณาตรวจสอบข้อมูลบัญชีเกมให้ถูกต้องก่อนทำการเติม</li>
            <li>• การเติม{selectedType === 'money' ? 'เงิน' : 'ทอง'}จะเข้าสู่บัญชีเกมทันทีหลังจากการทำรายการสำเร็จ</li>
            <li>• ยอดเงินจะถูกหักจากบัญชีของคุณเมื่อทำรายการสำเร็จ</li>
            <li>• หากพบปัญหา กรุณาติดต่อฝ่ายบริการลูกค้า</li>
          </ul>
        </div>
      </div>

      {/* Modal ยืนยันการเติม */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-xl font-bold mb-4">
              ยืนยันการเติม{selectedType === 'money' ? 'เงิน' : 'ทอง'}
            </Dialog.Title>

            {selectedOption && (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">จำนวน{selectedType === 'money' ? 'เงิน' : 'ทอง'}</span>
                    <span className="font-bold">
                      {selectedType === 'money' ? '฿' : '🌟'}{selectedOption.amount.toLocaleString()}
                    </span>
                  </div>
                  {selectedOption.bonus > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">โบนัส</span>
                      <span className="text-green-500">
                        {selectedType === 'money' ? '฿' : '🌟'}{selectedOption.bonus.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-400">ราคา</span>
                    <span className="font-bold text-blue-500">
                      ฿{selectedOption.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    onClick={() => setIsConfirmOpen(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    onClick={handleTopUp}
                    disabled={loading}
                  >
                    {loading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default TopUp;
