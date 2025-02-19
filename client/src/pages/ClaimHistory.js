import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { FiSearch, FiFilter, FiCalendar, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';

// ข้อมูลตัวอย่าง
const sampleClaims = [
  {
    id: 'CLM001',
    type: 'banned',
    reason: 'บัญชีถูกแบนโดยไม่ทราบสาเหตุ',
    status: 'approved',
    createdAt: '2024-02-18T10:00:00',
    updatedAt: '2024-02-19T15:30:00',
    newAccountId: 'NEW123',
    evidence: 'evidence1.jpg',
    product: 'Premium Account',
    amount: 1500
  },
  {
    id: 'CLM002',
    type: 'not_received',
    reason: 'ไม่ได้รับสินค้าหลังชำระเงิน',
    status: 'rejected',
    createdAt: '2024-02-17T14:20:00',
    updatedAt: '2024-02-18T09:15:00',
    rejectReason: 'ไม่พบหลักฐานการชำระเงิน',
    product: 'Standard Account',
    amount: 800
  }
];

function ClaimHistory() {
  const [claims] = useState(sampleClaims);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date'); // 'date', 'status', 'amount'
  const [sortOrder, setSortOrder] = useState('desc');

  const statusColors = {
    pending: 'bg-yellow-600',
    reviewing: 'bg-blue-600',
    approved: 'bg-green-600',
    rejected: 'bg-red-600'
  };

  const statusText = {
    pending: 'รอการตรวจสอบ',
    reviewing: 'กำลังตรวจสอบ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธแล้ว'
  };

  const typeText = {
    banned: 'บัญชีถูกแบน',
    not_received: 'ไม่ได้รับสินค้า',
    wrong_item: 'ได้รับสินค้าผิด',
    other: 'อื่นๆ'
  };

  // กรองและเรียงลำดับข้อมูล
  const filteredAndSortedClaims = useMemo(() => {
    let result = [...claims];

    // กรองตามสถานะ
    if (filterStatus !== 'all') {
      result = result.filter(claim => claim.status === filterStatus);
    }

    // กรองตามการค้นหา
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(claim => 
        claim.id.toLowerCase().includes(query) ||
        claim.reason.toLowerCase().includes(query) ||
        claim.product.toLowerCase().includes(query)
      );
    }

    // กรองตามวันที่
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      result = result.filter(claim => {
        const date = new Date(claim.createdAt);
        return date >= start && date <= end;
      });
    }

    // เรียงลำดับ
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [claims, filterStatus, searchQuery, dateRange, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    // TODO: ส่งออกข้อมูลเป็น CSV หรือ Excel
    console.log('Exporting data...');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* ส่วนหัว */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold">ประวัติการเคลม</h2>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              <FiDownload />
              <span>ส่งออกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* แถบค้นหาและตัวกรอง */}
        <div className="p-6 bg-gray-750">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ค้นหา */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาจากรหัส, เหตุผล, สินค้า..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ตัวกรองสถานะ */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอการตรวจสอบ</option>
                <option value="reviewing">กำลังตรวจสอบ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="rejected">ปฏิเสธแล้ว</option>
              </select>
            </div>

            {/* ช่วงวันที่ */}
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ส่วนแสดงผล */}
        <div className="p-6">
          {/* หัวตาราง */}
          <div className="grid grid-cols-5 gap-4 mb-4 font-semibold text-gray-400">
            <button
              className="flex items-center space-x-1"
              onClick={() => handleSort('date')}
            >
              <span>วันที่</span>
              {sortBy === 'date' && (
                sortOrder === 'desc' ? <FiChevronDown /> : <FiChevronUp />
              )}
            </button>
            <span>รหัสการเคลม</span>
            <button
              className="flex items-center space-x-1"
              onClick={() => handleSort('status')}
            >
              <span>สถานะ</span>
              {sortBy === 'status' && (
                sortOrder === 'desc' ? <FiChevronDown /> : <FiChevronUp />
              )}
            </button>
            <span>ประเภท</span>
            <button
              className="flex items-center space-x-1"
              onClick={() => handleSort('amount')}
            >
              <span>มูลค่า</span>
              {sortBy === 'amount' && (
                sortOrder === 'desc' ? <FiChevronDown /> : <FiChevronUp />
              )}
            </button>
          </div>

          {/* รายการเคลม */}
          <div className="space-y-4">
            {filteredAndSortedClaims.map(claim => (
              <div
                key={claim.id}
                className="bg-gray-700 p-6 rounded-lg hover:bg-gray-650 transition cursor-pointer"
                onClick={() => setSelectedClaim(claim.id === selectedClaim?.id ? null : claim)}
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="text-gray-400">
                    {format(new Date(claim.createdAt), 'dd/MM/yyyy', { locale: th })}
                  </div>
                  <div className="font-medium">{claim.id}</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[claim.status]}`}>
                      {statusText[claim.status]}
                    </span>
                  </div>
                  <div>{typeText[claim.type]}</div>
                  <div className="text-right">฿{claim.amount.toLocaleString()}</div>
                </div>

                {/* รายละเอียดเพิ่มเติม */}
                {selectedClaim?.id === claim.id && (
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">รายละเอียด</h4>
                        <p className="text-gray-400">{claim.reason}</p>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">สินค้า</h4>
                          <p className="text-gray-400">{claim.product}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">การดำเนินการ</h4>
                        {claim.status === 'approved' ? (
                          <div className="space-y-2">
                            <p className="text-green-400">ได้รับการอนุมัติ</p>
                            <p className="text-gray-400">ไอดีใหม่: {claim.newAccountId}</p>
                          </div>
                        ) : claim.status === 'rejected' ? (
                          <div className="space-y-2">
                            <p className="text-red-400">ถูกปฏิเสธ</p>
                            <p className="text-gray-400">เหตุผล: {claim.rejectReason}</p>
                          </div>
                        ) : (
                          <p className="text-gray-400">อยู่ระหว่างดำเนินการ</p>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">ประวัติการดำเนินการ</h4>
                      <div className="relative pl-8 space-y-6">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-600"></div>
                        <div className="relative">
                          <div className="absolute left-[-1.6rem] w-4 h-4 bg-blue-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">ยื่นคำขอเคลม</p>
                            <p className="text-sm text-gray-400">
                              {format(new Date(claim.createdAt), 'PPPp', { locale: th })}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute left-[-1.6rem] w-4 h-4 bg-blue-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">
                              {claim.status === 'approved' ? 'ได้รับการอนุมัติ' :
                               claim.status === 'rejected' ? 'ถูกปฏิเสธ' :
                               'อัพเดทสถานะ'}
                            </p>
                            <p className="text-sm text-gray-400">
                              {format(new Date(claim.updatedAt), 'PPPp', { locale: th })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ไม่พบข้อมูล */}
          {filteredAndSortedClaims.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">ไม่พบประวัติการเคลม</p>
              <p className="text-gray-500 mt-2">ลองปรับเปลี่ยนตัวกรองหรือคำค้นหา</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimHistory;
