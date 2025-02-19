import React from 'react';

const statusSteps = {
  pending: {
    step: 1,
    title: 'รอการตรวจสอบ',
    description: 'คำขอของคุณกำลังรอการตรวจสอบจากทีมงาน',
    icon: '⏳'
  },
  reviewing: {
    step: 2,
    title: 'กำลังตรวจสอบ',
    description: 'ทีมงานกำลังตรวจสอบคำขอของคุณ',
    icon: '🔍'
  },
  approved: {
    step: 3,
    title: 'อนุมัติแล้ว',
    description: 'คำขอของคุณได้รับการอนุมัติ ไอดีใหม่จะถูกส่งให้คุณผ่านข้อความ',
    icon: '✅'
  },
  rejected: {
    step: 3,
    title: 'ปฏิเสธ',
    description: 'คำขอของคุณถูกปฏิเสธ กรุณาติดต่อแอดมินสำหรับรายละเอียดเพิ่มเติม',
    icon: '❌'
  }
};

function ClaimStatus({ status = 'pending', claimId, updatedAt }) {
  const currentStatus = statusSteps[status];
  const steps = Object.values(statusSteps);
  const currentStep = currentStatus.step;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">สถานะการเคลม #{claimId}</h3>
        <span className="text-sm text-gray-400">
          อัพเดทล่าสุด: {new Date(updatedAt).toLocaleString('th-TH')}
        </span>
      </div>

      {/* แสดงสถานะปัจจุบัน */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentStatus.icon}</span>
          <div>
            <h4 className="font-semibold">{currentStatus.title}</h4>
            <p className="text-gray-400">{currentStatus.description}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {steps.slice(0, -1).map((step, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center">
              <div className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full 
                ${currentStep > step.step ? 'bg-green-600' : 
                  currentStep === step.step ? 'bg-blue-600' : 'bg-gray-600'}
              `}>
                {currentStep > step.step ? '✓' : step.step}
              </div>
              <div className="flex-1 ml-4">
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 2 && (
              <div className={`
                absolute left-4 ml-[-1px] w-0.5 h-full 
                ${currentStep > step.step ? 'bg-green-600' : 'bg-gray-600'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* คำแนะนำ */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="font-semibold mb-2">หมายเหตุ:</h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          <li>คุณสามารถติดตามสถานะการเคลมได้ที่หน้านี้</li>
          <li>หากมีข้อสงสัย สามารถติดต่อแอดมินผ่านแชทได้ตลอด 24 ชั่วโมง</li>
          <li>กรุณาเก็บหมายเลขการเคลม #{claimId} ไว้อ้างอิง</li>
        </ul>
      </div>
    </div>
  );
}

export default ClaimStatus;
