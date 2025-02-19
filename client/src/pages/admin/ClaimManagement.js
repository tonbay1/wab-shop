import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Chat from '../../components/Chat';

const initialClaims = [
  {
    id: 1,
    userId: 'user123',
    type: 'banned',
    reason: 'บัญชีถูกแบนโดยไม่ทราบสาเหตุ',
    status: 'pending',
    createdAt: '2024-02-19',
    contact: 'line: user123',
    email: 'user@example.com'
  }
];

function AdminClaimManagement() {
  const [claims, setClaims] = useState(initialClaims);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [newAccountId, setNewAccountId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveClaim = async (claim) => {
    if (!newAccountId) {
      toast.error('กรุณากรอกไอดีใหม่');
      return;
    }

    try {
      // TODO: ส่งข้อมูลไปยัง API
      setClaims(claims.map(c => 
        c.id === claim.id 
          ? { ...c, status: 'approved' }
          : c
      ));

      toast.success('อนุมัติการเคลมสำเร็จ');
      setSelectedClaim(null);
      setNewAccountId('');
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error('เกิดข้อผิดพลาดในการอนุมัติการเคลม');
    }
  };

  const handleRejectClaim = async (claim) => {
    if (!rejectReason) {
      toast.error('กรุณาระบุเหตุผลในการปฏิเสธ');
      return;
    }

    try {
      // TODO: ส่งข้อมูลไปยัง API
      setClaims(claims.map(c => 
        c.id === claim.id 
          ? { ...c, status: 'rejected', rejectReason }
          : c
      ));

      toast.success('ปฏิเสธการเคลมสำเร็จ');
      setSelectedClaim(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error('เกิดข้อผิดพลาดในการปฏิเสธการเคลม');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">จัดการการเคลม</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* รายการเคลม */}
        <div>
          <h2 className="text-xl font-semibold mb-4">รายการเคลมทั้งหมด</h2>
          <div className="space-y-4">
            {claims.map(claim => (
              <div 
                key={claim.id}
                className="border p-4 rounded-lg hover:shadow-md cursor-pointer"
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">User ID: {claim.userId}</p>
                    <p className="text-sm text-gray-600">ประเภท: {claim.type}</p>
                    <p className="text-sm text-gray-600">เหตุผล: {claim.reason}</p>
                    <p className="text-sm text-gray-600">วันที่: {claim.createdAt}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* รายละเอียดเคลม */}
        {selectedClaim && (
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">รายละเอียดเคลม</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">User ID: {selectedClaim.userId}</p>
                <p>ประเภท: {selectedClaim.type}</p>
                <p>เหตุผล: {selectedClaim.reason}</p>
                <p>ติดต่อ: {selectedClaim.contact}</p>
                <p>อีเมล: {selectedClaim.email}</p>
                <p>สถานะ: {selectedClaim.status}</p>
                {selectedClaim.rejectReason && (
                  <p>เหตุผลที่ปฏิเสธ: {selectedClaim.rejectReason}</p>
                )}
              </div>

              {selectedClaim.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ไอดีใหม่
                    </label>
                    <input
                      type="text"
                      value={newAccountId}
                      onChange={(e) => setNewAccountId(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="กรอกไอดีใหม่"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      เหตุผลในการปฏิเสธ
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="กรอกเหตุผลในการปฏิเสธ"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApproveClaim(selectedClaim)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => handleRejectClaim(selectedClaim)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                </div>
              )}

              {/* แชท */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">แชท</h3>
                <Chat claimId={selectedClaim.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminClaimManagement;
