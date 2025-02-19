import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

const idPackages = [
  {
    id: 1,
    price: 79,
    title: 'ชุดไอดีพร้อมเล่น',
    color: 'bg-blue-600',
    image: '/images/packages/starter.jpg',
    features: [
      'ไอดีระดับเริ่มต้น',
      'พร้อมเล่นทันที',
      'มีไอเทมพื้นฐาน',
      'เหมาะสำหรับผู้เล่นใหม่'
    ]
  },
  {
    id: 2,
    price: 99,
    title: 'ชุดไอดีพร้อมแลน',
    color: 'bg-red-600',
    image: '/images/packages/basic.jpg',
    features: [
      'ไอดีระดับกลาง',
      'มีรถพื้นฐาน',
      'มีไอเทมครบครัน',
      'เหมาะสำหรับผู้เล่นทั่วไป'
    ]
  },
  {
    id: 3,
    price: 139,
    title: 'ชุดไอดีพร้อมแลน',
    color: 'bg-green-600',
    image: '/images/packages/advanced.jpg',
    features: [
      'ไอดีระดับสูง',
      'มีรถหลายคัน',
      'มีไอเทมพิเศษ',
      'เหมาะสำหรับผู้เล่นจริงจัง'
    ]
  },
  {
    id: 4,
    price: 159,
    title: 'ชุดไอดีพร้อมแลน',
    color: 'bg-red-600',
    image: '/images/packages/premium.jpg',
    features: [
      'ไอดีระดับพรีเมียม',
      'มีรถหายาก',
      'มีไอเทมพิเศษจำนวนมาก',
      'เหมาะสำหรับผู้เล่นที่ต้องการความพิเศษ'
    ]
  },
  {
    id: 5,
    price: 329,
    title: 'ชุดไอดีพร้อมแลน',
    color: 'bg-red-600',
    image: '/images/packages/ultimate.jpg',
    features: [
      'ไอดีระดับสูงสุด',
      'มีรถหายากครบชุด',
      'มีไอเทมพิเศษครบชุด',
      'เหมาะสำหรับผู้เล่นระดับสูง'
    ]
  }
];

function ShopID() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // โหลดยอดเงินคงเหลือ
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

  const handleBuy = async () => {
    if (!selectedPackage) return;

    if (selectedPackage.price > balance) {
      toast.error('ยอดเงินคงเหลือไม่เพียงพอ');
      setIsConfirmOpen(false);
      return;
    }

    setLoading(true);
    try {
      // หักเงินจากบัญชี
      await axios.post('/api/payment/deduct', {
        amount: selectedPackage.price
      });

      // ทำการซื้อไอดี
      const response = await axios.post('/api/accounts/buy', {
        packageId: selectedPackage.id
      });

      if (response.data.success) {
        toast.success('ซื้อไอดีสำเร็จ');
        setBalance(prev => prev - selectedPackage.price);
      } else {
        // คืนเงินกรณีซื้อไม่สำเร็จ
        await axios.post('/api/payment/refund', {
          amount: selectedPackage.price
        });
        toast.error(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      // คืนเงินกรณีเกิดข้อผิดพลาด
      await axios.post('/api/payment/refund', {
        amount: selectedPackage.price
      });
      toast.error('เกิดข้อผิดพลาดในการซื้อไอดี');
      console.error('Buy Account Error:', error);
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ยอดเงินคงเหลือ */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="text-gray-400 mb-2">ยอดเงินคงเหลือ</div>
        <div className="text-3xl font-bold text-blue-500">฿{balance.toLocaleString()}</div>
      </div>

      {/* รายการชุดไอดี */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {idPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`${pkg.color} rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105`}
          >
            {/* รูปภาพชุด */}
            <div className="relative h-48">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 px-3 py-1 m-2 rounded-full">
                <span className="text-xl font-bold">{pkg.price} บาท</span>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{pkg.title}</h3>
              </div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setIsConfirmOpen(true);
                }}
                className="w-full px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
              >
                ซื้อเลย
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal ยืนยันการซื้อ */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-xl font-bold mb-4">
              ยืนยันการซื้อไอดี
            </Dialog.Title>

            {selectedPackage && (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  {/* รูปภาพในโมดอล */}
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedPackage.image}
                      alt={selectedPackage.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-bold mb-2">{selectedPackage.title}</h3>
                  <div className="space-y-2 mb-4">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-400">ราคา</span>
                    <span className="font-bold text-blue-500">
                      ฿{selectedPackage.price.toLocaleString()}
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
                    onClick={handleBuy}
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

export default ShopID;
