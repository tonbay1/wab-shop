import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

const depositOptions = [
  { amount: 100, bonus: 0 },
  { amount: 300, bonus: 15 },
  { amount: 500, bonus: 50 },
  { amount: 1000, bonus: 150 },
  { amount: 2000, bonus: 400 },
];

const paymentMethods = [
  { id: 'promptpay', name: 'PromptPay', icon: '/images/payment/promptpay.png' },
  { id: 'credit', name: 'บัตรเครดิต/เดบิต', icon: '/images/payment/credit-card.png' },
  { id: 'truemoney', name: 'True Money', icon: '/images/payment/true-money.png' },
  { id: 'bank', name: 'โอนผ่านธนาคาร', icon: '/images/payment/bank-transfer.png' },
];

function Deposit() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenConfirm = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount) {
      toast.error('กรุณาเลือกจำนวนเงิน');
      return;
    }

    if (!selectedMethod) {
      toast.error('กรุณาเลือกวิธีการชำระเงิน');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleDeposit = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || !selectedMethod) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/payment/topup', {
        amount,
        paymentMethod: selectedMethod.id
      });

      if (response.data.success) {
        toast.success('เติมเงินสำเร็จ');
        setSelectedAmount(null);
        setCustomAmount('');
        setSelectedMethod(null);
      } else {
        toast.error(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเติมเงิน');
      console.error('Deposit Error:', error);
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };

  // หาโบนัสสำหรับจำนวนที่เลือก
  const getBonus = (amount) => {
    const option = depositOptions.find(opt => opt.amount === amount);
    return option ? option.bonus : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">เติมเงินเข้าบัญชี</h2>

        {/* ตัวเลือกจำนวนเงิน */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {depositOptions.map(({ amount, bonus }) => (
            <button
              key={amount}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAmount === amount
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 hover:border-blue-500'
              }`}
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount('');
              }}
            >
              <div className="text-xl font-bold mb-2">฿{amount.toLocaleString()}</div>
              {bonus > 0 && (
                <div className="text-green-500 text-sm">
                  + โบนัส ฿{bonus.toLocaleString()}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* จำนวนเงินที่ต้องการเติม */}
        <div className="mb-8">
          <label className="block text-gray-300 mb-2">หรือระบุจำนวนเงินที่ต้องการเติม</label>
          <div className="flex space-x-4">
            <input
              type="number"
              min="1"
              placeholder="ระบุจำนวนเงิน"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
          </div>
        </div>

        {/* วิธีการชำระเงิน */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">วิธีการชำระเงิน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`p-4 rounded-lg transition ${
                  selectedMethod?.id === method.id
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <img src={method.icon} alt={method.name} className="h-8 mx-auto mb-2" />
                <div>{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ปุ่มเติมเงิน */}
        <button
          onClick={handleOpenConfirm}
          disabled={loading || (!selectedAmount && !customAmount) || !selectedMethod}
          className={`w-full px-8 py-3 rounded-lg text-lg font-semibold transition ${
            loading || (!selectedAmount && !customAmount) || !selectedMethod
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'กำลังดำเนินการ...' : 'เติมเงิน'}
        </button>
      </div>

      {/* Modal ยืนยันการเติมเงิน */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-xl font-bold mb-4">
              ยืนยันการเติมเงิน
            </Dialog.Title>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">จำนวนเงิน</span>
                  <span className="font-bold">
                    ฿{(selectedAmount || parseInt(customAmount)).toLocaleString()}
                  </span>
                </div>
                {selectedAmount && getBonus(selectedAmount) > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">โบนัส</span>
                    <span className="text-green-500">
                      ฿{getBonus(selectedAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-600">
                  <span className="text-gray-400">วิธีชำระเงิน</span>
                  <span className="font-bold">
                    {selectedMethod?.name}
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
                  onClick={handleDeposit}
                  disabled={loading}
                >
                  {loading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default Deposit;
