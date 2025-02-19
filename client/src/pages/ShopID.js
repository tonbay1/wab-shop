import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ShopID = () => {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "ชุดเริ่มต้น",
      price: 500,
      description: "ไอดีเริ่มต้น พร้อมรถ 1 คัน",
      features: ["รถ 1 คัน", "เงินในเกม 10,000", "ระดับ 5"],
      image: "https://via.placeholder.com/300x200"
    },
    {
      id: 2,
      name: "ชุดมือใหม่",
      price: 1000,
      description: "ไอดีสำหรับมือใหม่ พร้อมรถ 2 คัน",
      features: ["รถ 2 คัน", "เงินในเกม 50,000", "ระดับ 10"],
      image: "https://via.placeholder.com/300x200"
    },
    {
      id: 3,
      name: "ชุด VIP",
      price: 2000,
      description: "ไอดี VIP พร้อมรถหายาก",
      features: ["รถหายาก 3 คัน", "เงินในเกม 100,000", "ระดับ 20"],
      image: "https://via.placeholder.com/300x200"
    }
  ]);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);

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

  const handleBuy = async () => {
    if (!selectedPackage) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      if (balance < selectedPackage.price) {
        toast.error('ยอดเงินไม่เพียงพอ กรุณาเติมเงิน');
        return;
      }

      const response = await axios.post('/api/payment/purchase-id', {
        packageId: selectedPackage.id,
        amount: selectedPackage.price
      }, {
        headers: { Authorization: token }
      });

      if (response.data.success) {
        toast.success('ซื้อไอดีสำเร็จ');
        fetchBalance();
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ร้านค้าไอดี</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">ยอดเงิน:</span>
          <span className="ml-2 text-green-500 font-bold">{balance.toLocaleString()} บาท</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-400 mb-4">{pkg.description}</p>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">คุณสมบัติ:</h4>
                <ul className="list-disc list-inside text-gray-400">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-500">{pkg.price.toLocaleString()} บาท</span>
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  ซื้อเลย
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">ยืนยันการซื้อ</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">{selectedPackage.name}</h3>
              <p className="text-gray-400">{selectedPackage.description}</p>
            </div>
            <div className="mb-4">
              <span className="text-gray-400">ราคา:</span>
              <span className="ml-2 text-green-500 font-bold">{selectedPackage.price.toLocaleString()} บาท</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleBuy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                ยืนยันการซื้อ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopID;
