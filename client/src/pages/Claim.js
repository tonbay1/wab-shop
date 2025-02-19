import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ClaimStatus from '../components/ClaimStatus';
import Chat from '../components/Chat';

function Claim() {
  const [claimForm, setClaimForm] = useState({
    type: '',
    reason: '',
    evidence: null,
    contact: ''
  });

  // สมมติว่าเป็นข้อมูลจาก API
  const [activeClaim, setActiveClaim] = useState({
    id: 'CLM001',
    status: 'reviewing',
    updatedAt: new Date(),
  });

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: ส่งข้อมูลไปยัง API
      toast.success('ส่งคำขอเคลมสำเร็จ กรุณารอการตรวจสอบจากแอดมิน');
      
      // บันทึกข้อมูลการเคลม
      setActiveClaim({
        id: 'CLM001',
        status: 'pending',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ฟอร์มส่งคำขอเคลม */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">เคลมสินค้า</h2>

          <form onSubmit={handleSubmitClaim} className="space-y-6">
            {/* ประเภทการเคลม */}
            <div>
              <label className="block text-gray-300 mb-2">ประเภทการเคลม</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                value={claimForm.type}
                onChange={(e) => setClaimForm({ ...claimForm, type: e.target.value })}
                required
              >
                <option value="">เลือกประเภท</option>
                <option value="banned">บัญชีถูกแบน</option>
                <option value="hacked">บัญชีถูกแฮก</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            {/* เหตุผล */}
            <div>
              <label className="block text-gray-300 mb-2">เหตุผล</label>
              <textarea
                className="w-full px-4 py-2 bg-gray-700 rounded-lg h-32"
                value={claimForm.reason}
                onChange={(e) => setClaimForm({ ...claimForm, reason: e.target.value })}
                placeholder="อธิบายรายละเอียดของปัญหา..."
                required
              />
            </div>

            {/* หลักฐาน */}
            <div>
              <label className="block text-gray-300 mb-2">หลักฐาน (ถ้ามี)</label>
              <input
                type="file"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                onChange={(e) => setClaimForm({ ...claimForm, evidence: e.target.files[0] })}
                accept="image/*,.pdf"
              />
              <p className="text-sm text-gray-400 mt-1">
                รองรับไฟล์ภาพและ PDF ขนาดไม่เกิน 10MB
              </p>
            </div>

            {/* ช่องทางติดต่อ */}
            <div>
              <label className="block text-gray-300 mb-2">ช่องทางติดต่อ</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                value={claimForm.contact}
                onChange={(e) => setClaimForm({ ...claimForm, contact: e.target.value })}
                placeholder="เช่น Line ID, เบอร์โทร"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
            >
              ส่งคำขอเคลม
            </button>
          </form>
        </div>

        {/* สถานะการเคลม */}
        <div className="space-y-6">
          <ClaimStatus claim={activeClaim} />
          
          {/* แชท */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">แชทกับแอดมิน</h3>
            <Chat claimId={activeClaim.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Claim;
