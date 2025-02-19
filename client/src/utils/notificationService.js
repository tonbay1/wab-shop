// ขออนุญาตใช้ Push Notification
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// สร้าง Push Notification
export const createNotification = ({ title, body, icon, onClick }) => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/logo192.png',
      badge: '/logo192.png',
      timestamp: Date.now(),
    });

    if (onClick) {
      notification.onclick = onClick;
    }
  }
};

// ส่ง Push Notification สำหรับการเคลม
export const sendClaimNotification = (type, data) => {
  const notifications = {
    newClaim: {
      title: 'คำขอเคลมใหม่',
      body: `คำขอเคลม #${data.claimId} จาก ${data.userName}`,
      onClick: () => window.location.href = '/admin/claims'
    },
    statusUpdate: {
      title: 'อัพเดทสถานะการเคลม',
      body: `คำขอเคลม #${data.claimId} ${data.status === 'approved' ? 'ได้รับการอนุมัติ' : 'ถูกปฏิเสธ'}`,
      onClick: () => window.location.href = '/claim'
    },
    newMessage: {
      title: 'ข้อความใหม่',
      body: `คุณมีข้อความใหม่จาก ${data.sender}`,
      onClick: () => window.location.href = data.chatUrl
    }
  };

  const notification = notifications[type];
  if (notification) {
    createNotification(notification);
  }
};

// Service Worker Registration
export const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};
