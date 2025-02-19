const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify';

export const sendLineNotification = async (token, message, imageUrl = null) => {
  try {
    const formData = new FormData();
    formData.append('message', message);
    
    if (imageUrl) {
      formData.append('imageFile', imageUrl);
    }

    const response = await fetch(LINE_NOTIFY_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to send Line notification');
    }

    return true;
  } catch (error) {
    console.error('Error sending Line notification:', error);
    return false;
  }
};

// ฟังก์ชันสำหรับส่งการแจ้งเตือนเกี่ยวกับการเคลม
export const sendClaimLineNotification = async (token, type, data) => {
  const notifications = {
    newClaim: {
      message: `\n🔔 คำขอเคลมใหม่ #${data.claimId}\nจาก: ${data.userName}\nประเภท: ${data.type}\nเหตุผล: ${data.reason}`,
      image: data.evidenceUrl
    },
    statusUpdate: {
      message: `\n📝 อัพเดทสถานะการเคลม #${data.claimId}\nสถานะ: ${
        data.status === 'approved' ? '✅ อนุมัติ' : '❌ ปฏิเสธ'
      }${data.status === 'approved' ? `\nไอดีใหม่: ${data.newAccountId}` : `\nเหตุผล: ${data.reason}`}`,
    },
    newMessage: {
      message: `\n💬 ข้อความใหม่\nจาก: ${data.sender}\nข้อความ: ${data.message}`,
      image: data.imageUrl
    }
  };

  const notification = notifications[type];
  if (notification) {
    return sendLineNotification(token, notification.message, notification.image);
  }
  return false;
};
