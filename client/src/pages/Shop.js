import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const cars = [
  {
    id: 1,
    name: 'Nissan Silvia S15',
    image: '/images/cars/silvia-s15.jpg',
    price: 35000,
    category: 'Drift',
    specs: {
      power: '250 HP',
      acceleration: '6.5s (0-100)',
      topSpeed: '240 km/h'
    }
  },
  // เพิ่มรถอื่นๆ
];

const categories = ['ทั้งหมด', 'Drift', 'Racing', 'Street', 'Luxury'];

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredCars = cars.filter(car => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || car.category === selectedCategory;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const handleBuy = async (car) => {
    if (car.price > balance) {
      toast.error('ยอดเงินคงเหลือไม่เพียงพอ');
      return;
    }

    try {
      // หักเงินจากบัญชี
      await axios.post('/api/payment/deduct', {
        amount: car.price
      });

      // ทำการซื้อรถ
      const response = await axios.post('/api/cars/buy', {
        carId: car.id
      });

      if (response.data.success) {
        toast.success('ซื้อรถสำเร็จ');
        setBalance(prev => prev - car.price);
      } else {
        // คืนเงินกรณีซื้อไม่สำเร็จ
        await axios.post('/api/payment/refund', {
          amount: car.price
        });
        toast.error(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      // คืนเงินกรณีเกิดข้อผิดพลาด
      await axios.post('/api/payment/refund', {
        amount: car.price
      });
      toast.error('เกิดข้อผิดพลาดในการซื้อรถ');
      console.error('Buy Car Error:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* ยอดเงินคงเหลือ */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="text-gray-400 mb-2">ยอดเงินคงเหลือ</div>
        <div className="text-3xl font-bold text-blue-500">฿{balance.toLocaleString()}</div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="ค้นหารถ..."
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="flex space-x-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="ราคาต่ำสุด"
              className="w-1/2 px-4 py-2 bg-gray-700 rounded-lg text-white"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="ราคาสูงสุด"
              className="w-1/2 px-4 py-2 bg-gray-700 rounded-lg text-white"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
            />
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{car.name}</h3>
              <div className="text-gray-400 mb-4">
                <div>กำลัง: {car.specs.power}</div>
                <div>อัตราเร่ง: {car.specs.acceleration}</div>
                <div>ความเร็วสูงสุด: {car.specs.topSpeed}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-500">
                  ฿{car.price.toLocaleString()}
                </span>
                <button
                  onClick={() => handleBuy(car)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  ซื้อเลย
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
