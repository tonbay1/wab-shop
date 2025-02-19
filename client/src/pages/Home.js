import React from 'react';
import { Link } from 'react-router-dom';

const featuredCars = [
  {
    id: 1,
    name: 'Nissan Silvia S15',
    image: '/images/cars/silvia-s15.jpg',
    price: 35000,
    category: 'Drift'
  },
  {
    id: 2,
    name: 'Toyota Supra MK4',
    image: '/images/cars/supra-mk4.jpg',
    price: 45000,
    category: 'Racing'
  },
  // เพิ่มรถยนต์อื่นๆ ตามต้องการ
];

const categories = [
  {
    id: 'racing',
    name: 'Racing',
    description: 'รถแข่งสมรรถนะสูง',
    image: '/images/categories/racing.jpg',
    count: 24
  },
  {
    id: 'drift',
    name: 'Drift',
    description: 'รถดริฟท์สายลับ',
    image: '/images/categories/drift.jpg',
    count: 18
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'รถคลาสสิคหายาก',
    image: '/images/categories/classic.jpg',
    count: 12
  },
  {
    id: 'supercar',
    name: 'Supercar',
    description: 'ซูเปอร์คาร์สุดหรู',
    image: '/images/categories/supercar.jpg',
    count: 8
  }
];

function Home() {
  return (
    <div className="space-y-12 px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[600px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-start p-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold">ค้นพบรถในฝันของคุณ</h1>
            <p className="text-xl text-gray-300">
              เลือกจากคอลเลคชั่นรถยนต์สุดพิเศษของเรา พร้อมระบบการซื้อที่ปลอดภัย
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              ช้อปเลย
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">หมวดหมู่ยอดนิยม</h2>
          <Link 
            to="/shop" 
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link 
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative h-64 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-2">{category.description}</p>
                <span className="text-sm text-gray-400">{category.count} รายการ</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">รถยนต์แนะนำ</h2>
          <Link 
            to="/shop" 
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map(car => (
            <Link 
              key={car.id}
              to={`/car/${car.id}`}
              className="group bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700/80 transition"
            >
              <div className="relative h-48">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-sm">
                  {car.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                <p className="text-2xl font-bold text-blue-500">
                  ฿{car.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
